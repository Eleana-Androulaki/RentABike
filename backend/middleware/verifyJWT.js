const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config()

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token']?.split(' ')[1];

    if(token)
    {
        jwt.verify(token,process.env.JWT_SECRET,(err, decodedUser)=>{
            if(err)
            {
                return res.status(401).send("Failed to Authenticate");
            }
            req.user = {};
            req.user.name = decodedUser.name;
            req.user.email = decodedUser.email;
            req.user.role = decodedUser.role;
            req.user._id = decodedUser._id;
            next();
        })
    }
    else
    {
        res.status(401).send("Failed to Authenticate");
    }
}