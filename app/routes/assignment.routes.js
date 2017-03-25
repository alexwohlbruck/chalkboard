var express = require('express');
var router = express.Router();
var Assignment = require.main.require('./app/models/assignment');
var errors = require.main.require('./config/errors');

router.post('/', function(req, res) {
	console.log(req.body);
	var assignment = new Assignment({
		name: req.body.name,
		teacher: "58425a38e8f02712a9df03eb",
		classroom: req.body.classroom,
		description: req.body.description,
		type: req.body.type
	});
	
	assignment.save().then(function(assignment) {
		console.log(assignment);
		res.status(200).json(assignment);
	}, function(err) {
		res.status(400).json(err);
	});
	
	// if (!req.user) return res.status(401).json({message: errors.unauthenticated});
});

module.exports = router;