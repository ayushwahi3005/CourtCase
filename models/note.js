var mongoose=require("mongoose");
var NoteSchema = new mongoose.Schema({
	username:String,
	desc:String,
	time:String,

});
module.exports = mongoose.model("Notes",NoteSchema);