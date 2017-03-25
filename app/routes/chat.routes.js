var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Conversation = require.main.require('./app/models/conversation');
var Message = require.main.require('./app/models/message');
var User = require.main.require('./app/models/user');
var errors = require.main.require('./config/errors');

router.get('/conversations', function(req, res) {
    req.user = {_id: '58425a38e8f02712a9df03eb'};
    if (req.user) {
        Conversation.aggregate([
            {$match: {participants: mongoose.Types.ObjectId(req.user._id)}},
            {$lookup: {
                from: 'messages',
                localField: '_id',
                foreignField: 'conversation',
                as: 'messages'
            }},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {
                $group: {
                    _id: '$_id',
                    name: {$first: '$name'},
                    photo: {$first: '$photo'},
                    participants: {$first: '$participants'},
                    preview: {$first: '$messages'}
                }
            },
            {$sort: {'preview.createdAt': -1}}
        ]).then(function(conversations) {
            return User.populate(conversations, {path: 'participants', select: 'name photo'});
        }).then(function(conversations) {
            return User.populate(conversations, {path: 'preview.user', select: 'name'});
        }).then(function(conversations) {
            return res.status(200).json(conversations);
        }).catch(function(err) {
            return res.status(400).json(err);
        });
    } else {
        return res.status(401).json({message: errors.unauthenticated});
    }
});

router.get('/conversations/:conversationID', function(req, res) {
    Promise.all([
        Conversation.findById(req.params.conversationID).lean(),
        Message
            .find({conversation: req.params.conversationID})
            .populate({path: 'user', select: 'name username photo'})
            .sort('createdAt')
            .limit(50)
    ]).then(function(results) {
        results[0].messages = results[1];
        return res.status(200).json(results[0]);
    }, function(err) {
        return res.status(400).json(err);
    });
});

router.post('/conversations', function(req, res) {
    if (req.user) {
        req.body.participants.push(req.user._id);
        var conversation = new Conversation({
            participants: req.body.participants
        });
        
        conversation.save().then(function(conversation) {
            return User.populate(conversation, {path: 'participants', select: 'name photo'});
        }).then(function(conversation) {
            return res.status(200).json(conversation);
        }).catch(function(err) {
            return res.status(400).json(err);
        });
    } else {
        return res.status(401).json({message: errors.unauthenticated});
    }
});

module.exports = router;