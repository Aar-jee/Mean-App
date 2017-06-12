var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var app = express();
var JWT_SECRET = 'xxx';

var db = null;
var uri = "mongodb://rohitghai91:mongodb1@conmanmongoproj-shard-00-00-tddt5.mongodb.net:27017,conmanmongoproj-shard-00-01-tddt5.mongodb.net:27017,conmanmongoproj-shard-00-02-tddt5.mongodb.net:27017/mittens?ssl=true&replicaSet=ConmanMongoProj-shard-0&authSource=admin";
//var uri = "mongodb://localhost:27017/mittens";
MongoClient.connect(uri,function(err,dbconn){
if(!err){
	console.log("we are connected");
	db = dbconn;
}
else{
console.log("fatgya bete");
}
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/conmanRoute', function(req,res){
	db.collection('meaows', function(err,meowsCollection){
		meowsCollection.find().toArray(function(err,meowsdata){
			return res.json(meowsdata);
		});
	});

    });

app.post('/conmanRoute', function(req,res){
	var token = req.headers.authorization;//new
	var user = jwt.decode(token,JWT_SECRET);//new
	db.collection('meaows', function(err,meowsCollection){
		var anyNewdata = {
			text : req.body.anydata,
			user : user._id,  // new
			username: user.username
		};
		meowsCollection.insert(anyNewdata,{w:1},function(err,meowsdata){
			return res.send();
			
		});
	});
	
});

app.put('/conmanRoute/remove',function(req,res){
	var token = req.headers.authorization;//new
	var user = jwt.decode(token,JWT_SECRET);//new
	db.collection('meaows', function(err,meowsCollection){
		var deleteDataId = req.body.x._id;
		meowsCollection.remove({_id: ObjectId(deleteDataId),user: user._id},{w:1},function(err,meowsdata){
			return res.send();
		});
	});
	
});

app.post('/users', function (req, res) {
	db.collection('loginuser', function (err, loginuserCollection) {
		bcrypt.genSalt(10, function (err, salt) {
			console.log("password visible-"+req.body.password);
			bcrypt.hash(req.body.password, salt, function (err, hash) {
				console.log("password hidden-"+hash);
				var newUserP = {
					username: req.body.username,
					password: hash
				};
				loginuserCollection.insert(newUserP, { w: 1 }, function (err) {
					return res.send();
				});
			});
		});
	});

});

app.put('/users/signin', function (req, res) {
	db.collection('loginuser', function (err, loginuserCollection) {
		if(req.body.username ===''){
			console.log('please enter some value in textbox');
			
		}
		else{
	loginuserCollection.findOne({username: req.body.username},function(err,userdata){
		if(userdata === null){
			
			console.log('username not found');
			
		}
		else{
			bcrypt.compare(req.body.password, userdata.password, function(err,result){
				if(result){
					var mytoken = jwt.encode(userdata, JWT_SECRET); //userdata is the username and user password that is coming from database
					return res.json({token: mytoken});
				}
				else{ return res.status(400).send();}
			});
	}
		});
		}
	});
});
app.listen(process.env.PORT, function(){
	console.log('running on 3000');
});
