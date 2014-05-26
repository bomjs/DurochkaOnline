var input = $('#room input');
var ul = $('#room ul');
var form = $('#room form');

var socket = io.connect('', {
    reconnect: false
});

socket
    .on('message', function(username, message, time) {
        printMessage(username + " : " + message + " (" +time + ")");
    })
    .on('leave', function(username, time) {
        printStatus(username + " вышел из чата   (" +time + ")");
    })
    .on('join', function(username, time) {
        printStatus(username + " вошёл в чат   (" +time + ")");
    })
    .on('connect', function() {
        printStatus("соединение установлено");
        form.on('submit', sendMessage);
        input.prop('disabled', false);
    })
    .on('disconnect', function() {
        printStatus("соединение потеряно");
        form.off('submit', sendMessage);
        input.prop('disabled', true);
        this.$emit('error');
    })
    .on('logout', function() {
        location.href = "/";
    })
    .on('error', function(reason) {
        if (reason == "handshake unauthorized") {
            printStatus("вы вышли из сайта");
        } else {
            setTimeout(function() {
                socket.socket.connect();
            }, 500);
        }
    });

function sendMessage() {
    var text = input.val();
    var time = (new Date).toLocaleTimeString();
    socket.emit('message', text, function() {
        printMessage("я: " + text + "  (" + time +")");
    });

    input.val('');
    return false;
}

function printStatus(status) {
    $('<li>').append($('<i>').text(status)).appendTo(ul);
}

function printMessage(text) {
    $('<li>').text(text).appendTo(ul);
}