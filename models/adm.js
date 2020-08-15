var mongoose=require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");

var AdmSchema=new mongoose.Schema({
	username:String,
	email:String,
	password:String
});
AdmSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Adm", AdmSchema);