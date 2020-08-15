var mongoose=require("mongoose");
var express=require("express");
var bodyParser=require("body-parser");
var passport=require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose= require("passport-local-mongoose");
var methodOverride=require("method-override");
var Adv=require("./models/adv");
var Advocate=require("./models/advocate");
var Advocatecase=require("./models/advocatecase");
var Notes=require("./models/note");



mongoose.connect("mongodb://localhost/courtcase");


var app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));




app.use(require("express-session")({
	secret: "This is my project",
	resave:false,
	saveUninitialized:false


}));

app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Adv.authenticate()));
passport.serializeUser(Adv.serializeUser());
passport.deserializeUser(Adv.deserializeUser());


app.get("/home",function(req,res){
	res.render("home");
});

app.get("/admin",function(req,res){
	res.render("adminLogin");
});

app.post("/admin",passport.authenticate("local",{
	successRedirect:"/admin/home",
	failureRedirect:"/admin"
}) ,function(req,res){
});
var adminsort={
	name:1
}
app.get("/admin/home",isLoggedAdmin,function(req,res){
	Advocate.find({},function(err,alladvocate){
		if(err){
			console.log(err);
		}
		else
		{
			res.render("adminpage",{Advocate:alladvocate});
		}
	}).sort(adminsort);
	
});

app.get("/registerAdvocate",function(req,res){
	res.render("registerAdvocate");
})
app.post("/registerAdvocate",function(req,res){
	req.body.username
	req.body.password
	Adv.register(new Adv({ username:req.body.username}),req.body.password,function(err,user)
	{
		if(err)
		{
			console.log(err);
			return res.render("registerAdvocate");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/home");
		});

	});
});


app.get("/",function(req,res){
	res.render("home");
});



	
	


app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
app.get("/loginAdvocate",function(req,res){
	res.render("loginAdvocate");
});
app.post("/loginAdvocate",passport.authenticate("local",{
	successRedirect:"/second",
	failureRedirect:"/loginAdvocate"
}) ,function(req,res){
});
app.get("/submitnote",function(req,res){
	res.render("submitnote");
});

app.get("/submitForm",function(req,res){
	res.render("submitform");

});

app.post("/submitForm",function(req,res){
	var username=req.body.username;
	var name=req.body.name;
	var uid=req.body.uid;
	var email=req.body.email;
	var desc=req.body.desc;
	var newAdvocate={ username:username, name:name , uid:uid , email:email , desc:desc };

	Advocate.create(newAdvocate, function(err,newlyCreated){
		if(err)
		{
			console.log(err)
		}
		else
		{
			console.log("New Advocate created");

			res.redirect("/second");
		}
	});

});
app.put("/admin/:id",function(req,res){
	Advocatecase.findByIdAndUpdate(req.params.id,req.body.case,function(err,updatedCase){

		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("admin/message");
		}
	});
});
app.get("/admin/admin/message",function(req,res){
	res.render("message");
});
app.get("/admin/:id",isLoggedAdmin,function(req,res){
	Advocate.findById(req.params.id, function(err,advocateFound){
	if(err){
			console.log(err);
		}
	else{
		Advocatecase.find({uid:advocateFound.uid},function(err,allcase){
			if(err){
				console.log(err);
			}
			else
			{


				res.render("show",{advocatecase:allcase,advocate:advocateFound});
			}
	    });

		

	    }
	});
	

});
app.get("/admin/:id/edit",function(req,res){
	Advocatecase.findById(req.params.id,function(err,advocatecase){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("adminedit",{advocatecase:advocatecase});
		}
	});
});





app.get("/admin/:id/submit",isLoggedAdmin,function(req,res){

	Advocate.findById(req.params.id, function(err,advocateFound){
	if(err){
			console.log(err);
		}
		else
		{

			res.render("adminform",{advocate:advocateFound});
		}
});
});
app.post("/admin/:id/submit",function(req,res){
	var uid=req.body.uid;
	var cid=req.body.cid;
	var cname=req.body.cname;
	var status=req.body.status;
	var newAdvocateCase={uid:uid,cid:cid,cname:cname,status:status};

	Advocatecase.create(newAdvocateCase,function(err,advcase){
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log("new Advocate case created");
		res.redirect("/admin/home");
	}
});
});
app.get("/second",isLogged  ,function(req,res){
	var user=req.user.username;
	Advocate.find({username:user}, function(err,advocateFound){
	if(err){
			console.log(err);
		}
	else{
		res.render("second",{username:req.user.username,advocate:advocateFound});
		}
	});
	

});


app.get("/advocate/:id",isLogged,function(req,res){
	Advocate.findById(req.params.id, function(err,advocateFound){
	if(err){
			console.log(err);
		}
	else{
		Advocatecase.find({uid:advocateFound.uid},function(err,allcase){
			if(err){
				console.log(err);
			}
			else
			{

				res.render("advocatecaseList",{username:req.body.username ,advocatecase:allcase,advocate:advocateFound});
			}
	    });

	    }
	});
	

});
var mysort={
		name:-1

	};
app.get("/client",function(req,res){
	res.render("client");
});
function callName(req, callback) { 

	var result;
	var advocateFound=req.adv;
	var desc=req.desc;


	
			const spawn=require('child_process').spawn;
		const process=spawn('python',['./compare.py',desc,advocateFound.desc]);
		process.stdout.on('data',data=>{
			
			result=data.toString();
			
			//console.log(advocateFound[0].name);
		});
		process.on('close',function(){
			return callback(result);
		})
      
   

} 
app.post("/client",function(req,res){
	var desc=req.body.desc;
	var result=[];
	console.log(desc);
	
	Advocate.find({},   function(err,advocateFound){
		if(err)
		{
			console.log(err);
		}
		else
		{

			var ratio=[];
			for(var j=0;j<advocateFound.length;j++)
			{
			Advocatecase.find({uid:advocateFound[j].uid},function(err,cases){
				if(err)
				{
					console.log(err);
				}
				else
				{
					var w=0;
					var t=0;
					var r=0;
					for(var i=0;i<cases.length;i++)
					{
						if(cases[i].status==="won")
						{
							w=w+1;
							t=t+1;

						}
						else if(cases[i].status==="loose"){
							t=t+1;
						}

					}
					ratio.push((w/t).toFixed(2));
				}
			});
		}
			 for(var i=0;i<advocateFound.length;i++)
			{
						var obj={
							adv:advocateFound[i],
							desc:desc
						}
						  callName(obj,function(res){
							result.push(res);
							
			
							
						});
			}
			setTimeout(()=>{
				console.log(result);
				console.log(ratio);
				res.render("clientResult",{advocate:advocateFound,result:result,ratio:ratio});
			},1000);
		
			
			
			

			
		}


	});
});
app.get("/client/:id",function(req,res){
	

	Advocate.findById(req.params.id, function(err,advocateFound){
	if(err){
			console.log(err);
		}
	else{
		Advocatecase.find({uid:advocateFound.uid},function(err,allcase){
			if(err){
				console.log(err);
			}
			else
			{


				res.render("clientshow",{advocate:advocateFound,advocatecase:allcase});
			}
	    });

	    }
	});
});
app.get("/notes/:id",isLogged, function(req,res){
	var user=req.user.username;
	Advocate.find({username:user},function(err,advocateFound){
		if(err)
		{
			console.log(err);
		}
		else
		{
			Notes.find({username:user},function(err,notes){
				res.render("note",{username:user,advocate:advocateFound,note:notes});
			});
			
		}
	});

	
});

app.post("/submitnote",function(req,res){
	var username=req.user.username;
	var desc=req.body.desc;
	

	var dt = new Date();
	var date = dt.getDate();
	var month=dt.getMonth()+1;
	var year=dt.getFullYear();
	var time = date+"-"+month+"-"+year;

	var note={username:username,desc:desc,time:time};
	Notes.create(note,function(err,newlyCreated){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/second");
		}
	});
});

app.get("/delete",function(req,res){
	Notes.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/second");
		}
	});
});


function isLogged(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/loginAdvocate");

}
function isLoggedAdmin(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/admin");

}

app.listen(3000,function(){
	console.log("Server started....");
});