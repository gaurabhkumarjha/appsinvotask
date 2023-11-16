const jwt = require('jsonwebtoken');
const User = require("../modules/modules")


// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
    const authorization = req.header('Authorization');

    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    //console.log(authorization);
    const token = authorization.split(' ')[1]
    //console.log(token);


    try {

        const { _id } = jwt.verify(token, 'your_secret_key_here');
        // console.log(_id);
        req.user = await User.findOne({ _id }).select('_id');
        // console.log( req.user);
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}

module.exports = authenticateToken