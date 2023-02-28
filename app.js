//jshint esversion: 6

/*
    ToDo
        - Fill out database credentials in the 'Database Setup' section for MongoDB Atlas
*/

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Database libraries
const mongoose = require('mongoose');
const e = require("express");
mongoose.set('strictQuery', false);

// Database Setup
const database = 'wikiDB';
if (process.env.PORT === undefined) {
    // Local Database connection
    mongoose.connect('mongodb://localhost:27017/' + database);
} else {
    // Cloud Database connection
    let username = "";
    let password = "";
    let clusername = "";
    mongoose.connect('mongodb+srv://' + username + ':' + password + '@' + clusername + '.mongodb.net/' + database);
}

// Database Schema / Model
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Article must have a name."]
    },
    content: {
        type: String
    }
});
const Article = mongoose.model("Article", articleSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));


//// Requests Targeting All Articles ////
app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }

        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        })
    });

//// Requests Targeting A Specific Article ////
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function (err, foundArticle) {
            if (!err) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }

        });
    })
    .put(function (req, res) {
        Article.findOneAndUpdate({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, {
            overwrite: true
        }, function (err) {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        });
    })
    .patch(function (req, res) {
        Article.findOneAndUpdate({
            title: req.params.articleTitle
        }, {
            $set: req.body
        },
        function (err) {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }            
        });
    })
    .delete(function (req, res) {
        Article.findOneAndDelete({
            title: req.params.articleTitle
        }, function (err) {
            if (!err) {
                res.send("Successfully deleted the corresponding article.");
            } else {
                res.send(err);
            }
        });
    });

app.listen(process.env.PORT || 3000, function () {
    console.log(process.env.PORT);
    if (process.env.PORT === undefined) {
        console.log("Server is running on port 3000.");
    } else {
        console.log("Server is running on port " + process.env.PORT + ".");
    }
});