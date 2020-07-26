const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../models/User');

router.get('/', verify, async (req, res) => { // protecting this route by require token

    // here I can get access to user on client side by saying req.user
    // then doing findOne and sending the ejs file while passing in the user
    const curUser = await User.findOne({ _id: req.user._id });
    console.log(curUser.username);
    res.send(req.user);
});


module.exports = router;