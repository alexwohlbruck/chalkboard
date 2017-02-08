// User routes - /api/user/...
var express = require('express');
var router = express.Router();
var User = require.main.require('./app/models/user');
var errors = require.main.require('./config/errors');

// Routes to deal with authentication
router.use('/auth', require('./auth.routes'));

router.route('/me')
    .get(function(req, res) {
        return res.status(req.user ? 200 : 404).json({
            user: req.user ? req.user : null
        });
    })
    .put(function(req, res) {
        if (req.user) {
            User.findOneAndUpdate({
                    '_id': req.user._id
                }, req.body.properties, {returnNewDocument: true}, function(err, user) {
                    if (err) { return res.status(400).json({message: errors.generic}); }
                    if (!user) { return res.status(204).json({message: errors.notFound}); }
                    return res.status(200).json({user});
                });
        } else {
            return res.status(401).json({message: errors.unauthorized});
        }
    })
    .delete(function(req, res) {
        
    });

router.get('/:userID', function(req, res) {
    User.findOne({_id: req.params.userID})
        .then(function(user) {
            if (!user) { return res.status(404).send(); }
            return res.status(200).json(user);
        }, function(err) {
            return res.status(400).json(err);
        });
});

module.exports = router;