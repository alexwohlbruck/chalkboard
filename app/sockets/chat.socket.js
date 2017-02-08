var User = require.main.require('./app/models/user');
var Message = require.main.require('./app/models/message');
var Conversation = require.main.require('./app/models/conversation');

module.exports = function(io) {
    var messages = [],
        selectedConversation = null;
    
    io.on('connection', function(socket) {
        if (socket.request.session.passport) {
            User.findById(socket.request.session.passport.user, 'name username photo')
                .then(function(user) {
                    socket.authenticatedUser = user;
                    io.emit('user:new', user);
                    
                    socket.emit('messages:existing', messages);
                    
                    socket.on('conversation:join', function(conversationID) {
                        console.log('joining conversation: ', conversationID);
                        socket.leave(selectedConversation);
                        selectedConversation = conversationID;
                        //  Conversation.findById(selectedConversation)
                        // .then(function(conversation) {
                    	// if (conversation && conversation.participants.find(o => o.equals(socket.authenticatedUser._id))) {
                    	                
                        socket.join(selectedConversation);
                    });
        	
                	socket.on('message:send', function(message) {
                	    if (message && message.text) {
                	        message = new Message({
        	                    conversation: selectedConversation,
        	                    text: message.text,
        	                    user: socket.authenticatedUser._id
        	                });
        	                
        	                message.save().then(function() {
                	            message.user = socket.authenticatedUser;
                    		    messages.push(message);
                    		    io.sockets.in(selectedConversation).emit('message:send', message);
                	        }, function(err) {
                	            console.log(err);
                	        });
                	    }
                	});
                }, function(err) {
                    console.log(err);
                });
        } else {
            // Unauthenticated
        }
    });
};