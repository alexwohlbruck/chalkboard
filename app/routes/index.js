var path = require('path');
var router = require('express').Router();

// Import all route groups
router.use('/users', require('./user.routes'));
router.use('/classrooms', require('./classroom.routes'));
router.use('/schools', require('./school.routes'));
router.use('/chat', require('./chat.routes'));
router.use('/friends', require('./friend.routes'));

router.get('*', function(req, res) {
    res.sendfile(path.join(__dirname, '/public/views/index.html')); // load our public/index.html file
});

module.exports = router;
