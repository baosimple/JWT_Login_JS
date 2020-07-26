const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.cookies['token'];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; //setting user equal to the user._id stored in the payload
        next();
    } catch {
        res.status(400).send('Invalid Token');
    }
}