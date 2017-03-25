var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
var errors = require.main.require('./config/errors');
var Message = require.main.require('./app/models/message');

/*

To do:
- Check that no other conversations with same participants exist

*/

var ConversationSchema = new Schema({
    name: String,
    photo: {type: String, default: "http://i.imgur.com/qMJOYVS.png"},
    participants: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        validate: [minArrayLength, errors.chat.create.insufficientParticipants]
    }
},{
    timestamps: true
});

function minArrayLength(val) {
  return val.length >= 2;
}

ConversationSchema.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt : true});

ConversationSchema.pre('save', function(next, done) {
    var that = this;
    this.constructor.findOne({participants: this.participants}).then(function(conversation) {
        if (conversation) {
            var err = new Error(errors.chat.create.alreadyExists);
            err.conversation = conversation;
            return done(err);
        } else {
            // Create welcome message
            var message = new Message({
                type: 'new',
                conversation: that._id,
                text: "Beginning of chat"
            });
            
            message.save().then(function() {
                next();
            });
        }
    }, function(err) {
        console.log(err);
    });
});

var Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;