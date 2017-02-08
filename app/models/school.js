var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

var SchoolSchema = new Schema({
    name: {type: String, required: true},
    district: {type: String, required: true},
    type: {type: String, enum: ['elementary', 'middle', 'high', 'college'], required: true},
    staffCode: {
        admin: {type: String, required: true, unique: true, select: false},
        teacher: {type: String, required: true, unique: true, select: false}
    },
    periods: {type: Number, required: true},
    buildings: [{
        name: {type: String, required: true},
        lunchPeriod: {type: Number, enum: [1, 2, 3, 4, 5]}
    }]
},{
    timestamps: true
});

SchoolSchema.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt : true});

var School = mongoose.model('School', SchoolSchema);

module.exports = School;