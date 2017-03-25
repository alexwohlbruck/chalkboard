var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MaterialSchema = new Schema({
    id:     {type: String, required: true},
    title:  {type: String, required: true}
});

var Material = mongoose.model('Material', MaterialSchema);

module.exports = {
    DriveFile:      Material.discriminator('DriveFile', new mongoose.Schema()),
    DriveFolder:    Material.discriminator('DriveFolder', new mongoose.Schema()),
    Link:           Material.discriminator('Link', new mongoose.Schema()),
    YoutubeVideo:   Material.discriminator('YoutubeVideo', new mongoose.Schema())
};