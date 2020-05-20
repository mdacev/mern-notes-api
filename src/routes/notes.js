const { Router } = require('express');
const router = Router();
const verifyToken = require('../controllers/verifyToken');

const { getNotes, createNote, getNote, deleteNote, updateNote } = require('../controllers/notes.controller');

router.route('/')
    .get(/*verifyToken, */ getNotes)
    .post(/*verifyToken,*/ createNote)

router.route('/:id')
    .get(getNote)
    .delete(deleteNote)
    .put(updateNote)

module.exports = router;


