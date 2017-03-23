var express = require('express');
var router = express.Router();
var Classroom = require.main.require('./app/models/classroom');
var School = require.main.require('./app/models/school');
var errors = require.main.require('./config/errors');

router.get('/me', function(req, res) {
    if (req.user) {
        Classroom.getUserSchools({_id: '582c590d594e991257b648dd'})
            .then(function(schoolIDs) {
                return School.find({_id: {$in: schoolIDs}}, 'name type district buildings periods');
            })
            .then(function(schools) {
                return res.status(200).json(schools);
            }, function(err) {
                return res.status(400).json(err);
            });
    } else {
        return res.status(401).json({message: errors.unauthenticated});
    }
});

module.exports = router;