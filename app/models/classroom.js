var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var mongooseDelete = require('mongoose-delete');
var _ = require('lodash');
var School = require.main.require('./app/models/school');
var coverPhotos = require.main.require('./config/covers');
var errors = require.main.require('./config/errors');

var ClassroomSchema = new Schema({
    name: {type: String, required: true},
    period: {
        block: {type: Number, required: true},
        ab: {type: String, enum: ['a', 'b', null], default: null}
    },
    cover: {type: String, default: coverPhotos.random},
    location: {
        school: {type: Schema.Types.ObjectId, ref: 'School', required: true},
        building: {type: Schema.Types.ObjectId, ref: 'School.buildings', required: true},
        number: {type: Number, required: true}
    },
    enrollmentCode: {type: String, required: true, unique: true, select: false},
    state: {type: String, enum: ['active', 'archived', 'provisioned'], default: 'provisioned'},
    teacher: {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    },
    students: [{
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        studentWorkFolder: {
            type: Schema.Types.ObjectId,
            ref: 'DriveFolder'
        }
    }]
}, {
    timestamps: true
});

ClassroomSchema.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt : true});

ClassroomSchema.statics.joinClassroom = function(enrollmentCode, authenticatedUser) {
    var deferred = Q.defer();
    
    this.findOne({enrollmentCode: enrollmentCode}).populate(['students.user', 'teacher.user'])
        .then(function(classroom) {
            if (!classroom) { return deferred.reject({status: 401, message: errors.invalidCode}); }
            
            if (classroom.students.find(function(o) {
                return o.user._id.equals(authenticatedUser._id) ? true : false;
            })) {
                return deferred.reject({status: 409, message: errors.classroom.alreadyEnrolled});
            }
            
            classroom.update({
                $push: {students: {user: authenticatedUser._id}}
            }).then(function() {
                return deferred.resolve(classroom);
            }, function(err) {
                return deferred.reject(err);
            });
        }, function(err) {
            return deferred.reject(err);
        });
        
    return deferred.promise;
};

ClassroomSchema.statics.createClassroom = function(authenticatedUser, data) {
    if (!authenticatedUser || !data || !data.classroom) return Promise.reject();
    var Classroom = this, deferred = Q.defer();
    
    Promise.all([
        Classroom.find({'teacher.user': authenticatedUser._id}), // Check if user already owns classes
        School.findOne({'staffCode.teacher': data.teacherCode}), // Check if code is correct
    ]).then(function(results) {
        // Make sure the school ID user provides matches on that user teaches
        var schoolsVerified = results[0].filter(function(o) {
            console.log(data);
            return o.location.school.equals(data.classroom.location.school);
        });
        
        console.log(schoolsVerified);
        if (schoolsVerified.length > 0) {
            return Promise.resolve(schoolsVerified[0]);
        } else if (results[1]) {
            return Promise.resolve(results[1]);
        } else if (data.teacherCode == '' || data.teacherCode) {
            deferred.reject({status: 401, message: errors.invalidCode});
        } else {
            deferred.reject({status: 401, message: errors.unauthorized});
        }
    }).then(function(school) {
        var generateCode = function() {
            var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
        
        var classroom = new Classroom({
            name: data.classroom.name,
            period: data.classroom.period ? {
                block: data.classroom.period.block,
                ab: data.classroom.period.ab || undefined
            } : null,
            location: data.classroom.location ? {
                school: school._id,
                building: data.classroom.location.building,
                number: data.classroom.location.number
            } : null,
            enrollmentCode: generateCode(),
            teacher: {
                user: authenticatedUser._id
            }
        });
        
        classroom.save()
            .then(function(classroom) {
                deferred.resolve(classroom);
            }, function(err) {
                console.log(err);
                deferred.reject(err);
            });
    }, function(err) {
        deferred.reject(err);
    });
    
    return deferred.promise;
};

ClassroomSchema.statics.getUserSchools = function(authenticatedUser) {
    var Classroom = this;
    
    return Promise.all([
        Classroom.find({'students.user': authenticatedUser._id}),
        Classroom.find({'teacher.user': authenticatedUser._id})
    ]).then(function(results) {
        var classrooms = results[0].concat(results[1]);
        var schools = classrooms.map(function(o) { return o.location.school; });
        schools = _.intersectionWith(schools, _.isEqual);
        return Promise.resolve(schools);
    });
};

var Classroom = mongoose.model('Classroom', ClassroomSchema);

module.exports = Classroom;