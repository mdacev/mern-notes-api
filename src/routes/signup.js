const { Router } = require('express');
const router = Router();

const { signup  } = require('../controllers/signup.controller');

const upload = require('../libs/storage')


router.route('/')
    .post(upload.single('image'), signup)
    

module.exports = router;
