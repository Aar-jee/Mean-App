var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bodyParser = require('body-parser');
var app = express();

var db = null;
var uri = "mongodb://rohitghai91:mongodb1@conmanmongoproj-shard-00-00-tddt5.mongodb.net:27017,conmanmongoproj-shard-00-01-tddt5.mongodb.net:27017,conmanmongoproj-shard-00-02-tddt5.mongodb.net:27017/mittens?ssl=true&replicaSet=ConmanMongoProj-shard-0&authSource=admin";
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
	db.collection('meaows', function(err,meowsCollection){
		var anyNewdata = {
			text : req.body.anydata
		};
		meowsCollection.insert(anyNewdata,{w:1},function(err,meowsdata){
			return res.send();
			
		});
	});
	
});

app.put('/conmanRoute/remove',function(req,res){
	db.collection('meaows', function(err,meowsCollection){
		var deleteDataId = req.body.x._id;
		meowsCollection.remove({_id: ObjectId(deleteDataId)},{w:1},function(err,meowsdata){
			return res.send();
		});
	});
	
});

app.post('/users', function(req,res){
 db.collection('loginuser', function(err,loginuserCollection){
		var anyNewdata = {
			text : req.body
		};
		loginuserCollection.insert(anyNewdata,{w:1},function(err){
			return res.send();
			
		});
	});
});
app.listen(process.env.PORT, function(){
	console.log('running on 3000');
});

