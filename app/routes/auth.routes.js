var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.status(info.status ? info.status : 400).json(info);
        if (user) user.local.password = undefined;
        
        req.logIn(user, function(err) {
            if (err) return next(err);
            
            return res.status(user ? 200 : 204).json({
                status: user ? 'success' : 'failure',
                message: info ? info.message : null,
                user: user ? user : null
            });
        });
    })(req, res, next);
});

router.post('/register', function(req, res, next) {
    passport.authenticate('register', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.status(info.status ? info.status : 400).json(info);
        if (user && user.local) user.local.password = undefined;
        
        req.logIn(user, function(err) {
            if (err) return next(err);
            
            return res.status(user ? 200 : 204).json({
                status: user ? 'success' : 'failure',
                message: info ? info.message : null,
                user: user ? user : null
            });
        });
    })(req, res, next);
});

router.get('/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/plus.me'
    ],
    accessType: 'offline',
    routerrovalPrompt: 'force'
}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/api/users/auth/google/success',
    failureRedirect: '/api/users/auth/google/failure'
}));

router.get('/google/:status', function(req, res) {
    return res.status(req.user ? 200 : 204).render('../public/views/other/after-auth', {
        status: req.params.status,
        user: req.user ? req.user : null
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    return res.status(204).send();
});

module.exports = router;