let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let ejs = require('ejs');
let app = express();

app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/WikiDB', {useNewUrlParser: true});

let articleSchema = mongoose.Schema({
	title: { type: String },
	content: { type: String }
});

let article = mongoose.model('article', articleSchema);



// Chained Routes
app.route('/articles')
.get(function(req, res){
	article.find({}, function( err, articleFound){
		res.send(articleFound);
	})
})
.post(function(req, res, err){
	console.log(req.body.title);
	console.log(req.body.content);
	let newPost = new article ({
		title: req.body.title,
		content: req.body.content
	});

	newPost.save(function (err){
		if(!err){
			res.send('Success message');
		}
		else{
			res.send(err);
		}
	})
})
.delete(function(req, res) {
	article.deleteMany( function(err){
		if(!err){
			res.send('Deletion Success');
		}
		else{
			res.send(err);
		}
	});
});


// routes for the specific article
app.route('/articles/:articleTitle')
.get(function(req,res){
	article.findOne({title: req.params.articleTitle}, function(err, foundTitle){
		if(foundTitle){
			res.send(foundTitle);
		}else{
			res.send("article not found");
		}
	})
})
.put(function(req, res) {
	article.update(
		{title: req.params.articleTitle},
		{title: req.body.title, content: req.body.content},
		{ovewrite: true},
		function(err, result){
			if(!err){
				res.send("successfully updated the article");
			}else{
				res.send(err)
			}
		}
	)
})
.patch(function(req, res){
	article.update(
		{title: req.params.articleTitle},
		{$set: req.body},
		function(err, result){
			if(!err){
				res.send("successfully patched the article");
			}else{
				res.send(err)
			}
		}
	)
})
.delete(function(req, res){
	article.deleteOne(
		{title: req.params.articleTitle},
		function(err){
			if(!err){
				res.send("article deleted success");
			}else{
				res.send(err);
			}
		})
})
app.listen(3000, function() {
	console.log("app listening on port 3000");
});