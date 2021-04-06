const express = require("express");
const router = express.Router();
const Post = require('../models/Post');

router.get("/", (req, res) => {
  res.send("Lets build a REST api on post end point");
});

//append specific to the /posts
router.get("/specific", (req, res) => {
    res.send("Specific Post");
  });

router.post('/', (req, res) => {
    //We need extra package to convert the req to a JSON object 
    //Body Parser
    //console.log(req.body);
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
    //return a promise -> save to the db 
    post.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
    });
});

module.exports = router;
