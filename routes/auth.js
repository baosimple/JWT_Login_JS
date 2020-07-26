const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

//REGISTER
router.post('/register', async (req, res) => {
    //validate data before creating a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if user is already in database
    const usernameExists = await User.findOne({ username: req.body.username });
    const emailExists = await User.findOne({ email: req.body.email });
    if (usernameExists) return res.status(400).send('Username already exists');
    if (emailExists) return res.status(400).send('Email already exists');

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save(); // mongoose method to save to database
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }

});

//LOGIN
router.post('/login', async (req, res) => {

    //validate data before logging in a user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email does not exist');

    //check password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Password is invalid');

    //create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.cookie('token', token, { // store it in an https only cookie
        secure: false, // set to true if your using https
        httpOnly: true,
    }).send(token);
    // res.header('auth-token', token).send(token);
});

module.exports = router;