const { Router } = require('express');
const router = Router();
//const verifyToken = require('../controllers/verifyToken');
const { signin  } = require('../controllers/signin.controller');
//const { getNotes  } = require('../controllers/notes.controller');

router.route('/')
    .post(signin)
    //.get(getNotes)

module.exports = router;
