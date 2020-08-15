var mongoose=require("mongoose");
var advocatecaseSchema = new mongoose.Schema({
	uid:String,
	cid:String,
	cname:String,
	status:String
});
module.exports = mongoose.model("Advocatecase",advocatecaseSchema);