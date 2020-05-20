const signinCrtl = {};
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../configback.js');

signinCrtl.signin = async (req, res, next) => {
    try {
        
        const {username , password} = req.body;
        console.log(username);
        const user = await User.findOne({username:username});
        console.log(user);
        if(!user){
            return res.status(220).json({status:201 , msg:'El usuario no existe.'});
        }
        const validPassword = await user.validatePassword(password);
        if(!validPassword){
            return res.status(220).json({auth:false , token: null, status:202 , msg:'Password incorrecta.'});
        }
        //const token = jwt.sign({id: user._id} , config.secret, {expiresIn: config.expiresIn});
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzU3NGZkZDExZThlMDAxNzU5Y2E0OSIsImlhdCI6MTU5MDAwNDE3MywiZXhwIjoxNTkwMjYzMzczfQ.4aT4PHEHo1h8uh7JxWVaIHRCDftCnHNW84MZFz45QqY';

        
        return res.json({auth: true, token, userId: user._id, username: user.username, avatar: user.image_url});
        
    }
    catch (err) {
        res.status(400).json({
            error: { msa: err, msg:'HDP jaja'}
        });
    }
};

module.exports = signinCrtl;