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
                const { username , password, email, google, image } = req.body;
                const fileTypes = new RegExp(/.jpg|.jpeg|.png|.gif/);
                const mimetype = true; 
                let _image_url = configback.cloudinary.image_url;
                let _public_id = configback.cloudinary.public_id;
                
               
                if((req.file && req.file !== undefined) && google == "false"){

                    console.log('req.file: ', req.file,'\n google: ', google);

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
                    console.log('result: ',result);
                    //para eliminar
                    //const result = await cloudinary.v2.uploader.destroy(req.file.path);
                    _image_url = result.url;
                    _public_id = result.public_id;
                    await fs.unlink(req.file.path);

                }

                if(google == "true"){
                    const user = await User.findOne({username:username});
                    
                    if(user){
                        return res.json({auth: true, status:200, exist:true, msg:'Your Google user has already registered.\nusername:Google name\npassword:Google email', path:'/'});
                    }
                    _image_url = image;
                    _public_id = _public_id + String(Math.floor(Math.random() * 10000));
                }

                console.log('_image_url: ',_image_url,'\n_public_id: ', _public_id);
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

                return res.json({auth: true, token, userId: newUser._id, username: newUser.username, password: newUser.password, avatar: newUser.image_url, status:200});
                
        }
        catch (err) {
            
            if(err.code === 11000){
                return res.json({auth: false, msg: 'El usuario ya existe.', status:200, code:err.code});
            }
            return res.status(400).json({
            
                error: err
            });
            
        }
};


module.exports = signupCrtl;