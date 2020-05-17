const signupCrtl = {};

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const configback = require('../configback.js');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');
const path = require('path');

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
});


signupCrtl.signup = async (req , res ) => {

        try {

            console.log('signup...')
                const { username , password, email } = req.body;
                const fileTypes = new RegExp(/.jpg|.jpeg|.png|.gif/);
                const mimetype = true; 
                let _image_url = configback.cloudinary.image_url;
                let _public_id = configback.cloudinary.public_id;
                
                if(req.file !== undefined){

                    const ext =  path.extname(req.file.originalname).toLocaleLowerCase();
                    
                    if(req.file.size  > configback.avatar_max_size){
                        await fs.unlink(req.file.path);
                        return res.json({auth: false, msg: 'The file must be at most 1Mb.', status:200, code:11002});
                    }
                    if(!fileTypes.test(ext)){
                        await fs.unlink(req.file.path);
                        return res.json({auth: false, msg: 'The file is invalid. just jpg, jpeg, png or gif.', status:200, code:11001});
                    }

                    //Cloudinary (hay que estar logeado)
                    const result = await cloudinary.v2.uploader.upload(req.file.path);
                    
                    //para eliminar
                    //const result = await cloudinary.v2.uploader.destroy(req.file.path);
                    _image_url = result.url;
                    _public_id = result.public_id;
                    await fs.unlink(req.file.path);

                }
                
                //MongoDB
                const newUser = new User ({
                    username, 
                    password, 
                    email,
                    image_url : _image_url,
                    public_id : _public_id
                });
                
                
                newUser.password = await newUser.encryptPassword(newUser.password);
                await newUser.save();
                const token =  jwt.sign({id: newUser._id} , configback.secret, {expiresIn: configback.expiresIn});
                return res.json({auth: true, token, status:200});
                
        }
        catch (err) {
            
            if(err.code === 11000){
                return res.json({auth: false, msg: 'El usuario ya existe.', status:200, code:11000});
            }
            return res.status(400).json({
            
                error: err
            });
            
        }
};


module.exports = signupCrtl;