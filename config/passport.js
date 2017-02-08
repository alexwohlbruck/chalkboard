var LocalStrategy  = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require('bcrypt-nodejs');
var keys = require.main.require('./config/keys'); // Secret stuff
var errors = require.main.require('./config/errors');
var coverPhotos = require.main.require('./config/covers');

var User = require('../app/models/user');

module.exports = function(passport, baseUrl) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // Local login strategy
    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            var criteria = (username.indexOf('@') == -1) ? {username: username} : {email: username};
            
            User.findOne(criteria).select('+local.password').exec(function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {status: 404, message: errors.auth.login.noUser});
                }
                if (!user.local.password) {
                    return done(null, false, {status: 409, message: errors.auth.login.googleAccount});
                }
                if (!isValidPassword(password, user.local.password)) {
                    return done(null, false, {status: 401, message: errors.auth.login.invalidPassword});
                }
                return done(null, user);
            });
        });
    }));
    
    // Local registration strategy
    passport.use('register', new LocalStrategy({ 
        passReqToCallback: true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({$or: [{'username': username}, {'email': req.body.email}]}, function(err, user) {
                if (err) {
                    return done(err, {message: errors.generic});
                }
                if (user) {
                    var message = user.username == username ? errors.auth.register.usernameExists : errors.auth.register.emailExists;
                    return done(null, false, {status: 409, message: message});
                } else {
                    User.findOneDeleted({$or: [{'username': username}, {'email': req.body.email}]})
                        .then(function(user) {
                            if (user) {
                                user.restore();
                                return done(null, user);
                            } else {
                                var newUser = new User();
                                
                                newUser.name = {
                                    first: req.body.name.first,
                                    last: req.body.name.last
                                };
                                newUser.local = {
                                    password: createHash(password)
                                };
                                newUser.username = username;
                                newUser.email = req.body.email;
                                newUser.gender = req.body.gender;
                                
                                newUser.save(function(err) {
                                    if (err) {
                                        // Return first error in errors list, if any
                                        return done(null, false, {status: 400, message: err.errors[Object.keys(err.errors)[0]].message});
                                    }
                                    return done(null, newUser);
                                });
                            }
                        }, function(err) {
                            return done(err);
                        });
                }
            });
        });
    }));
    
    passport.use(new GoogleStrategy({
        clientID: keys.oauth.clientID,
        clientSecret: keys.oauth.clientSecret,
        callbackURL: keys.oauth.callbackUrl,
        proxy: true // Use https
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({'google.id': profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                } else {
                    User.findOne({'email': profile.emails[0].value}, function(err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (user) {
                            User.update({email: user.email}, {
                                photo: profile.photos[0] && !profile._json.image.isDefault ? profile.photos[0].value.replace("?sz=50", "?sz=200") : user.photo,
                                cover: profile._json.cover && profile._json.cover != '' ? profile._json.cover.coverPhoto.url : user.cover,
                                google: {
                                    id: profile.id,
                                    refreshToken: refreshToken
                                }
                            }, {runValidators: true}, function(err) {
                                if (err) {
                                    return done(err);
                                }
                                return done(null, user);
                            });
                        } else {
                            User.findOneDeleted({$or: [{'email': profile.emails[0].value}, {'google.id': profile.id}]})
                                .then(function(user) {
                                    if (user) {
                                        user.restore()
                                            .then(function() {
                                                return done(null, user);
                                            }, function(err) {
                                                return done(err);
                                            });
                                    } else {
                                        var newUser = new User();
                                        profile.username = (profile.url ? profile.url.split('/+')[1].replace(/[^a-z0-9_]/, '') : profile.emails[0].value.split('@')[0]).replace(/[^a-z0-9_]/, '');
                                        if (profile.gender) profile.gender = profile.gender.toLowerCase();
                                        
                                        checkValidUsername(profile.username, done, function(username) {
                                            newUser.name.first = profile.name.givenName;
                                            newUser.name.last = profile.name.familyName;
                                            newUser.username = username;
                                            newUser.email = profile.emails[0].value;
                                            newUser.gender = (profile.gender == 'male' || profile.gender == 'female') ? profile.gender : null;
                                            newUser.photo = profile.photos[0] && !profile._json.image.isDefault ? profile.photos[0].value.replace("?sz=50", "?sz=200") : undefined;
                                            newUser.cover = profile._json.cover ? profile._json.cover.coverPhoto.url : coverPhotos.random();
                                            newUser.account.role = 'generic';
                                            newUser.google.id = profile.id;
                                            newUser.google.refreshToken = refreshToken;
                                            
                                            newUser.save(function(err) {
                                                if (err) {
                                                    return(done, null, {message: err.errors[Object.keys(err.errors)[0]].message});
                                                }
                                                return done(null, newUser);
                                            });
                                        });
                                    }
                                }, function(err) {
                                    return done(err);
                                });
                            
                        }
                    });
                }
            });
        });
    }));
    
    var createHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);  
    };
    
    var isValidPassword = function(password, hash) {
        return bcrypt.compareSync(password, hash);
    };
    
    var checkValidUsername = function(username, done, callback, increment) {
        increment = increment || 0;
        User.findOne({'username': username + (increment == 0 ? "" : increment)}, function(err, user) {
            if (err) {
                console.log(err);
                return done(err);
            }
            if (user) {
                return checkValidUsername(username, done, callback, ++increment);
            } else {
                if (callback) callback(username + (increment == 0 ? "" : increment));
            }
        });
    };
};