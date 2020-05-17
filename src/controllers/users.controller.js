const userCtrl = {};

const User = require('../models/User');

userCtrl.getUsers = async (req, res) => {
    try {
        const users = await User.find({},{
            password: 0,
            email: 0
            })
            .sort({username: 1});
        res.json(users);
    }
    catch (err) {
        res.status(400).json({
            error: err
        });
    }
}

userCtrl.createUser = async (req, res) => {
    try {
        const { username } = req.body;

        const newUser = new User({ username });
        await newUser.save();
        res.json('User created');
    } catch (e) {
        console.log(e)
        res.json(e.errmsg);
    }
};


userCtrl.deleteUser = async (req, res) => {

    try{
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json('User deleted');
    }
    catch (err) {
        res.status(400).json({
            error: err
        });
    }
}

module.exports = userCtrl;