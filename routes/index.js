var checkAuth = require('middleware/checkAuth');

module.exports = function(app) {

    app.get('/', require('./frontpage').get);

    app.get('/login', require('./login').get);

    app.post('/login', require('./login').post);

    app.get('/registration', require('./registration').get);

    app.post('/registration', require('./registration').post);

    app.post('/logout', require('./logout').post);

    app.get('/game_field', checkAuth, require('./game_field').get);

};