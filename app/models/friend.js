var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
var errors = require.main.require('./config/errors');

var FriendSchema = new Schema({
    users: {
        sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        reciever: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    },
    accepted: {type: Boolean, default: false}
},{
    timestamps: true
});

FriendSchema.index({'users.sender': 1, 'uses.reciever': 1}, {unique: true});

FriendSchema.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt : true});

var Friend = mongoose.model('Friend', FriendSchema);

module.exports = Friend;