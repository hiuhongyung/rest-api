const router = require("express").Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  // VALIDATE THE INPUT
  const { error } = registerValidation(req.body);
  // CHECK WHETHER THERE IS ERROR
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK IF THE USER IS ALREADY EXIST
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10); // GENERATE SALT
  const hashPassword = await bcrypt.hash(req.body.password, salt); //COMBINE PASSWORD WITH SALT

  // CREATE A NEW USER
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser); // {user:user.id} -> better not show all the information
  } catch (err) {
    res.status(400).send(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //CHECKING IF THE USER ALREADY EXIST  
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found");

  //PASSWORD IS CORRECT 
  const validPass = await bcrypt.compare(req.body.password, user.password); //latter one is the hashed one stored in the db
  if(!validPass) return res.status(400).send('Invalid Password');

  //CREATE AND ASSIGN TOKEN 
  const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token); 
  res.send('Logged In');

});

module.exports = router;
