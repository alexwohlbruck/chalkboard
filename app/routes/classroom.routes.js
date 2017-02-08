// Classroom routes - /api/classroom/...
var express = require('express');
var router = express.Router();
var Classroom = require.main.require('./app/models/classroom');
var User = require.main.require('./app/models/user');
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
        Classroom.findOne({_id: req.params.classroomID})
            .populate([
                {path: 'teacher.user', model: 'User', select: 'username email name photo gender'},
                {path: 'students.user', model: 'User', select: 'username email name photo gender'}
            ])
            .then(function(classroom) {
                if (!classroom) return res.status(404).send();
                
                classroom = classroom.toObject();
                
                var isStudent = classroom.students.find(o => o.user._id.equals(req.user._id));
                var isTeacher = (classroom.teacher.user._id.equals(req.user._id));
                var isAuthorized = isStudent || isTeacher ? true : false;
                
                if (isAuthorized) {
                    return res.status(200).json(classroom);
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
        return res.status(200).json(data);
    }, function(err) {
        if (err.status) return res.status(err.status).json({message: err.message});
        return res.status(400).json(err);
    });
});

module.exports = router;