const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique : true},
        password: { type: String, required: true},
        email: { type: String, required: true},
        image_url: {type: String},
        public_id: {type: String}
    }
);

userSchema.methods.encryptPassword = async (password) => {

    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password , salt);
};

userSchema.methods.validatePassword = function (password){
    console.log('pass: ', password , this.password);
    return bcrypt.compare(password , this.password);
};

module.exports = model('User', userSchema);