var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
// var Material = require('../schemas/material.schema');

var AssignmentSchema = new Schema({
    name:       {type: String, required: true},
    teacher:    {type: Schema.Types.ObjectId, ref: 'User', required: true},
    classroom:  {type: Schema.Types.ObjectId, ref: 'Classroom', required: true},
    description:{type: String},
    // materials:  [Material],
    type:       {type: String, enum: ['upload', 'quiz', 'text'], required: true},
    quiz:       {type: Schema.Types.ObjectId, ref: 'Quiz'},
    dueAt:      {type: Date, default: +new Date() + 24*60*60*1000}
},{
    timestamps: true
});

AssignmentSchema.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt : true});

var Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = Assignment;