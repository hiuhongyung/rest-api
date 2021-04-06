const express = require("express");
// Ability to create Route
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");


app.use(bodyParser.json());

//Import Routes 
const postsRoute = require('./routes/posts');
app.use("/posts", postsRoute);

//Middlewares
//a function will execute when we hit the routes  -> even authentication

app.use("/posts", () => {
  console.log("This middleware function is running");
});

//Routes (get, post , patch, delete )
app.get("/", (req, res) => {
  res.send("Lets build a REST api");
});



//Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("Connected to the mongo db");
  }
);

//How to we start listening to the server
app.listen(3000);

//Hide the password and username by using dotenv
