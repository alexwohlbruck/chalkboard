var User = require.main.require('./app/models/user');
var Message = require.main.require('./app/models/message');
var Conversation = require.main.require('./app/models/conversation');

module.exports = function(io) {
    // var messages = [],
        // selectedConversation = null;
    
    io.on('connection', function(socket) {
        console.log('connected');
        // User.findById(socket.request.session.passport.user, 'name username photo')
        // socket.emit('messages:existing', messages);
        
        socket.on('conversation:join', function(conversationID) {
            // socket.leave(selectedConversation);
            // selectedConversation = conversationID;
            //  Conversation.findById(selectedConversation)
            // .then(function(conversation) {
        	// if (conversation && conversation.participants.find(o => o.equals(socket.authenticatedUser._id))) {
        	                
            // socket.join(selectedConversation);
        });

    	socket.on('message:send', function(message) {
    	    var user = socket.request.user;
    	    
    	    if (message && message.text) {
    	        message = new Message({
                    conversation: message.conversation,
                    text: message.text,
                    user: user._id,
                    type: 'message'
                });
                
                message.save().then(function(message) {
                    return User.populate(message, {path: 'user', select: 'name photo'});
    	        })
    	        .then(function(message) {
    	            io.emit('message:send', message);
    	        }, function(err) {
    	            console.log(err);
    	        });
    	    }
    	});
    });
};