var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
var validateFunctions = require.main.require('./config/validate');
var coverPhotos = require.main.require('./config/covers');
var Classroom = require.main.require('./app/models/classroom');

var UserSchema = new Schema({
    name: {
        first:  {type: String, required: true},
        last:   {type: String, required: true}
    },
    username:   {type: String, required: true, unique: true, validate: validateFunctions.alphanumeric},
    email:      {type: String, required: true, unique: true, validate: validateFunctions.email},
    gender:     {type: String, enum: [null, 'male', 'female'], default: null},
    photo:      {type: String, default: "https://imgur.com/NXDGaBD.png"},
    cover:      {type: String, default: coverPhotos.random},
    account: {
        superuser: {type: Boolean, default: false}
    },
    local: {
        password: {type: String, select: false},
    },
    google: {
        id:     {type: String},
        refreshToken: {type: String}
    }
},{
    timestamps: true
});

UserSchema.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt : true});

UserSchema.pre('delete', function(next) {
    var that = this, accumulator = [];
    
    Promise.all([
        Classroom.find({'teacher.user': that._id}),
        Classroom.find({'students.user': that._id})
    ]).then(function(results) {
        for (var i = 0; i < results[0].length; i++) {
            accumulator.push(results[0][i].delete());
        }
        for (var i = 0; i < results[1].length; i++) {
            accumulator.push(results[1][i].update({
                $pull: {students: {user: that._id}}
            }));
        }
        return Promise.all(accumulator);
    }).finally(next());
});

var User = mongoose.model('User', UserSchema);

module.exports = User;