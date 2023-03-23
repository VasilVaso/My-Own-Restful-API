//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title : String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function (req, res){
    Article.find()
    .then(function(foundArticles){
        res.send(foundArticles);
    })
    .catch(function(err){
        console.log(err);
    })
})

.post(function(req,res){
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save()
    .then(function(foundArticles){
        res.send("Success");
    })
    .catch(function(err){
        console.log(err);
    });
})

.delete(function(req,res){
    Article.deleteMany()
    .then(function(){
        res.send("deleted all articles");
    })
    .catch(function(err){
        console.log(err);
    });
})

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle})
    .then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        } else
        res.send("not found")
    })
    .catch(function(err){
        console.log(err)
    })
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {upsert: true})
        .then(function(){
            res.send("success")
        })
        .catch(function(err){
            console.log(err)
        })
    })
.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set : req.body})
        .then(function(){
            res.send("haha")
        })
        .catch(function(err){
            console.log(err)
        })
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle})
    .then(function(){
        res.send("suck my dick")
    })
    .catch(function(err){
        console.log(err)
    })
})


//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});