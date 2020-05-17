const multer = require('multer');
const config = require('../configback.js');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, config.img_storage)
  },
  filename: function (req, file, cb) {
    cb( null, Date.now() + path.extname(file.originalname).toLocaleLowerCase() );
  }
});

const upload = multer( 
    {   storage,
        destination: config.img_storage ,
        fileFilter: function (req, file, cb) {
            const fileTypes = /jpg|jpge|png|gif/;
            const mimetype = fileTypes.test(file.mimetype);
            const extname = fileTypes.test(path.extname(file.originalname));
            if((mimetype && extname) || !file){
                return cb(null, true);
            }
            else{
                return cb(null, "El archivo debe ser una imagen.");
            }
           
        }
        
    } 
);

module.exports = upload;