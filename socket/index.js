var log = require('lib/log')(module);
var config = require('config');
var connect = require('connect'); // npm i connect
var async = require('async');
var cookie = require('cookie'); // npm i cookie
var sessionStore = require('lib/sessionStore');
var HttpError = require('error').HttpError;
var User = require('models/user').User;
var FoolGame = require('models/Gameserver');

var free = null;

function loadSession(sid, callback) {

    // sessionStore callback is not quite async-style!
    sessionStore.load(sid, function(err, session) {
        if (arguments.length == 0) {
            // no arguments => no session
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });

}

function loadUser(session, callback) {

    if (!session.user) {
        log.debug("Session %s is anonymous", session.id);
        return callback(null, null);
    }

    log.debug("retrieving user ", session.user);

    User.findById(session.user, function(err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }
        log.debug("user findbyId result: " + user);
        callback(null, user);
    });

}

module.exports = function(server) {
    var io = require('socket.io').listen(server);
    io.set('origins', 'localhost:*');
    io.set('logger', log);

    io.set('authorization', function(handshake, callback) {
        async.waterfall([
            function(callback) {
                // сделать handshakeData.cookies - объектом с cookie
                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookies[config.get('session:key')];
                var sid = connect.utils.parseSignedCookie(sidCookie, config.get('session:secret'));

                loadSession(sid, callback);
            },
            function(session, callback) {

                if (!session) {
                    callback(new HttpError(401, "No session"));
                }

                handshake.session = session;
                loadUser(session, callback);
            },
            function(user, callback) {
                if (!user) {
                    callback(new HttpError(403, "Anonymous session may not connect"));
                }

                handshake.user = user;
                callback(null);
            }

        ], function(err) {
            if (!err) {
                return callback(null, true);
            }

            if (err instanceof HttpError) {
                return callback(null, false);
            }

            callback(err);
        });

    });

    function closeRoom(game_id, enemy){
        socket.leave(game_id);
        io.sockets.socket(enemy).leave(game_id);
    }
    io.sockets.on('session:reload', function(sid) {
        var clients = io.sockets.clients();

        clients.forEach(function(client) {
            if (client.handshake.session.id != sid) return;

            loadSession(sid, function(err, session) {
                if (err) {
                    client.emit("error", "server error");
                    client.disconnect();
                    return;
                }
                if (!session) {
                    client.emit("logout");
                    client.disconnect();
                    return;
                }

                client.handshake.session = session;
            });

        });

    });

    io.sockets.on('connection', function(socket) {

        console.log('%s: %s - connected', socket.id.toString(), socket.handshake.address.address);

        var username = socket.handshake.user.get('username');
        var time = (new Date).toLocaleTimeString();

        socket.broadcast.emit('join', username, time);

        socket.on('message', function(text, cb) {
            socket.broadcast.emit('message', username, text, time);
            cb && cb();
        });
        socket.on('disconnect', function() {
            socket.broadcast.emit('leave', username, time);
        });
        socket.on('step',function(game_id,id){
            FoolGame.Step(game_id,id,socket);
        });
        socket.on('start', function(){
            if(!free){
                io.sockets.socket(socket.id).emit('wait');
                free=socket.id;
            }else{
                var game_id = free+socket.id;
                io.sockets.socket(free).emit('ready',game_id, false);
                socket.emit('ready',game_id, true);
                socket.join(game_id);
                io.sockets.socket(free).join(game_id);
                io.sockets.in(game_id).emit('message', "Game Server : ", "Good luck", time);
                FoolGame.CreateGame(game_id, socket,io.sockets.socket(free),0,0);
                free=null;
            }
        })
        socket.on('endstep', function(game_id){
            FoolGame.endstep(game_id, socket);
        })
        socket.on('take', function(game_id){
            FoolGame.takeAll(game_id, socket);
        })

    });

    return io;
};