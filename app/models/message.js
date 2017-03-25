var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
var errors = require.main.require('./config/errors');

var MessageSchema = new Schema({
    type:        {type: String, enum: ['message', 'userAdd', 'userLeave', 'rename', 'new'], required: true},
    conversation:   {type: Schema.Types.ObjectId, ref: 'Conversation', required: true},
    text:           {type: String, required: true},
    user:           {type: Schema.Types.ObjectId, ref: 'User'}
},{
    timestamps: true
});

MessageSchema.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt : true});

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;