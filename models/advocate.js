var mongoose=require("mongoose");
var advocateSchema = new mongoose.Schema({
	username:String,
	name:String,
	uid:String,
	email:String,
	desc:String,

});
module.exports = mongoose.model("Advocate",advocateSchema);