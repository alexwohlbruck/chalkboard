module.exports = function(io, cookieParser) {
    /*io.set('authorization', function(handshake, next) {
        if (handshake.headers.cookie) {
            handshake.cookie = cookieParser(handshake.headers.cookie);
            handshake.session = handshake.cookie['express.sid'];
        } else {
            return next('Not authenticated', false);
        }
        next(null, true);
    });*/
    
    require('./chat.socket')(io);
};