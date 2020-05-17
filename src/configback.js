module.exports = {

    secret : process.env.CLOUDINARY_API_SECRET, //"secret_text" deberia ser una variable de entorno.
    expiresIn: 60 * 60 * 72, //3 dias
    img_storage: './src/storage/img',
    cloudinary:{
        image_url : 'http://res.cloudinary.com/dhimwdncv/image/upload/v1587412064/iebw6cu8ka9mkvjkvxpq.jpg',
        public_id : 'iebw6cu8ka9mkvjkvxpq'
    },
    avatar_max_size: 1000000 //1MB
}