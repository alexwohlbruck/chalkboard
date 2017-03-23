var express = require('express');
var router = express.Router();
var User = require.main.require('./app/models/user');
var Friend = require.main.require('./app/models/friend');
var errors = require.main.require('./config/errors');

router.get('/', function(req, res) {
    // req.params.q
    if (req.user) {
        Promise.all([
            Friend.find({'users.sender': req.user._id, 'accepted': true}),
            Friend.find({'users.reciever': req.user._id, 'accepted': true})
        ]).then(function(results) {
            var recievers = results[0].map(o => o.users.reciever),
                senders = results[1].map(o => o.users.sender),
                allFriends = recievers.concat(senders);
            User.find({_id: {$in: allFriends}}, 'name username email photo')
                .then(function(friends) {
                    return res.status(200).json(friends);
                }, function(err) {
                    return res.status(400).json(err);
                });
        });
    } else {
        return res.status(401).json({message: errors.unauthenticated});
    }
});

router.post('/', function(req, res) {
    if (req.user) {
        if (req.body.userID == req.user._id)
            return res.status(409).json({message: errors.friends.sendFriendRequest.requestSelf});
        
        var friend = new Friend({
            users: {
                sender: req.user._id,
                reciever: req.body.userID
            }
        });
        friend.save(function(friend) {
            return res.status(200).json(friend);
        }, function(err) {
            return res.status(400).json(err);
        });
    } else {
        return res.status(401).json({message: errors.unauthenticated});
    }
});

module.exports = router;