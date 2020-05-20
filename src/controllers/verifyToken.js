const jwt = require('jsonwebtoken');
const config = require('../configback.js');

 function verifyToken ( req , res, next) {

   
    const token = req.headers['x-access-token'];
    console.log("token ---> ", token);
    if(!token || token === '-1'){
        const resp = res.json({
            auth:false , 
            status: 403,
            message: "You don't have permission to access."
        });
        return resp;
    }
    const decode =  jwt.verify(token, config.secret);
    req.userId = decode.id;
    console.log("req.userId -> ", req.userId);
    next();
    
    
}

module.exports = verifyToken;