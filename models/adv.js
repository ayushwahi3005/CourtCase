var mongoose=require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");

var AdvSchema=new mongoose.Schema({
	username:String,
	email:String,
	password:String
});
AdvSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Adv", AdvSchema);