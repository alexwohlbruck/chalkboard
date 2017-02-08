
// Main server script for serving files and I/O connections

// Modules =================================================

var express = require('express');
var app = express();
var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
var passport = require('passport');
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var keys = require('./config/keys'); // Secret stuff
require('./config/passport')(passport); // Passport config

var port = process.env.PORT || 8080;
var ip = process.env.IP || "0.0.0.0";

// Connect to database
mongoose.connect(keys.database.url); 

// Set templating engine
app.set('view engine', 'ejs');

// Middleware ==============================================
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

// Passport config
var sessionMiddleware = session({secret: keys.session.secret, resave: true, saveUninitialized: true});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions

// Pass authorization to socket.io middleware
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// Define routes
app.use('/api', require('./app/routes'));

// Create websocket connections
require('./app/sockets')(io, cookieParser);

require.main.require('./app/mailer');

require.main.require('./app/models/conversation');

// Run Server
server.listen(port, ip, function() {
	var addr = server.address();
	console.log("Magic happens on", addr.address + ":" + addr.port);
});
