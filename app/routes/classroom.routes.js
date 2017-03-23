var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var Classroom = require.main.require('./app/models/classroom');
var User = require.main.require('./app/models/user');
var Post = require.main.require('./app/models/post');
var errors = require.main.require('./config/errors');

// Get enrolled and teaching classrooms
router.get('/', function(req, res) {
    if (req.user) {
        Promise.all([
            Classroom.find({'students.user': req.user._id})
                .populate([
                    {path: 'teacher.user', model: 'User', select: 'username email name photo gender'},
                    {path: 'students.user', model: 'User', select: 'username email name photo gender'}
                ]),
            Classroom.find({'teacher.user': req.user._id})
                .populate([
                    {path: 'teacher.user', model: 'User', select: 'username email name photo gender'},
                    {path: 'students.user', model: 'User', select: 'username email name photo gender'}
                ])
        ]).then(function(results) {
            if (!results[0] && !results[1]) return res.status(404).send();
            res.status(200).json({
                enrolled: results[0],
                teaching: results[1]
            });
        }, function(err) {
            res.status(err.status).json(err.data);
        });
    } else {
        return res.status(401).json({message: errors.unauthenticated});
    }
});

// Get a classroom
router.get('/:classroomID', function(req, res) {
    if (req.user) {
        Promise.props({
            classroom: Classroom.findOne({_id: req.params.classroomID})
                .populate([
                    {path: 'teacher.user', model: 'User', select: 'username email name photo gender'},
                    {path: 'students.user', model: 'User', select: 'username email name photo gender'}
                ]),
            posts: Post.find({classroom: req.params.classroomID})
                .sort('-createdAt')
                .populate({path: 'user', model: 'User', select: 'username name photo gender'})
        })
        
        .then(function(results) {
            if (!results.classroom) return res.status(404).send();
            
            results.classroom = results.classroom.toObject();
            results.classroom.posts = results.posts;
            
            var isStudent = results.classroom.students.find(o => o.user._id.equals(req.user._id));
            var isTeacher = (results.classroom.teacher.user._id.equals(req.user._id));
            var isAuthorized = isStudent || isTeacher ? true : false;
            
            if (isAuthorized) {
                return res.status(200).json(results.classroom);
            } else {
                return res.status(401).json({message: errors.unauthorized});
            }
        }, function(err) {
            return res.status(400).json(err);
        });
    } else {
        return res.status(401).json({message: errors.unauthenticated});
    }
});

// Add student to classroom
router.post('/students', function(req, res) {
    if (req.user) {
        Classroom.joinClassroom(req.body.enrollmentCode, req.user)
            .then(function(classroom) {
                return res.status(200).json(classroom);
            }, function(err) {
                if (err.status) {
                    return res.status(err.status).json({message: err.message});
                }
                return res.status(400).json(err);
            });
    } else {
        return res.status(401).json({message: errors.unauthenticated});
    }
});

// Create classroom
router.post('/', function(req, res) { // Takes <classroom> data.classroom (partial data), <string> data.teacherCode
    Classroom.createClassroom(
        req.user,
        req.body
    ).then(function(data) {
        return res.status(201).json(data);
    }, function(err) {
        if (err.status) return res.status(err.status).json({message: err.message});
        return res.status(400).json(err);
    });
});

// Add post to classroom
router.post('/:classroomID/posts', function(req, res) {
    ////////////////////////////////////////////////////////////////////////////////////////////////// Check that user is a teacher
    if (req.user) {
        var post = new Post({
            user: req.user._id,
            classroom: req.params.classroomID,
            type: req.body.type,
            text: req.body.text,
            assignment: req.body.assignment,
            question: req.body.question
        });
        
        post.save().then(function(post) {
            var promise = Post.populate(post, {path: 'user', select: 'username name photo gender'});
            console.log(promise);
            return promise;
        })
        .then(function(post) {
            return res.status(201).json(post);
        }, function(err) {
            return res.status(400).json(err);
        });
    }
});

module.exports = router;