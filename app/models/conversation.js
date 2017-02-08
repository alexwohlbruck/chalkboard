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
            return Message.save(new Message({
                type: ""
            }));
            next();
        }
    }, function(err) {
        console.log(err);
    });
});

var Conversation = mongoose.model('Conversation', ConversationSchema);

var convo = new Conversation({
    name: "Salty Spitoon " + Math.floor(Math.random() * 1000),
    participants: ['582c590d594e991257b648dd', '58425a38e8f02712a9df03eb']
});

convo.save(function(err, data) {
    console.log(err, data);
});

module.exports = Conversation;