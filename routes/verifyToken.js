const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    verifyToken: (req, res, next) => {
        const token = req.cookies['token'];
        if (!token) return res.status(401).send('No Token');

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified; //setting user equal to the user._id stored in the payload
            console.log('Valid Token');
            next();
        } catch {
            const refreshToken = req.cookies['refresh-token'];
            console.log(refreshToken);
            if (!refreshToken) return res.status(401).send('Invalid/Expired Token and No Refresh Token');
            try {
                const verifiedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                console.log('Valid refresh token. Generating new token pair...');
                const newTokens = JSON.parse(generateTokens(verifiedRefresh));
                console.log('newTokens: ');
                console.log(newTokens);
                console.log(newTokens['token']);
                console.log(newTokens['refreshToken']);

                res.cookie('token', newTokens['token'], { // store it in an https only cookie
                    secure: false, // set to true if your using https
                    httpOnly: true
                });
                console.log('hi2')
                res.cookie('refresh-token', newTokens['refreshToken'], {
                    secure: false,
                    httpOnly: true
                })
                const verified2 = jwt.verify(newTokens.token, process.env.TOKEN_SECRET);
                console.log(verified2);
                req.user = verified2;
                next();

            } catch {
                res.status(400).send('Invalid/Expired Token and Invalid/Expired Refresh Token');
            }
        }
    }


}

function generateTokens(userID) {
    console.log("uid " + JSON.stringify(userID));
    console.log('hi0');
    const newToken = jwt.sign({ _id: userID._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE });
    const newRefreshToken = jwt.sign({ _id: userID._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE })
    console.log('hi1')

    console.log('hi3')

    return JSON.stringify({ 'token': newToken, 'refreshToken': newRefreshToken });
}