module.exports = function(io, cookieParser) {
    
    require('./chat.socket')(io);
};

// Give socket the user information when loggin in
// See public/js/services/auth.service.js this.success() and this.setUser()
/*socket.on('auth:login', function(user) {
    console.log('login', user);
    socket.handshake.session.user = user;
    socket.handshake.session.save();
});

socket.on('auth:logout', function() {
    if (socket.handshake.session.user) {
        delete socket.handshake.session.user;
        socket.handshake.session.save();
    }
});*/