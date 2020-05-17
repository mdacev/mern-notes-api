const notesCtrl = {};
const jwt = require('jsonwebtoken');
const Note = require('../models/Note');
const config = require('../configback.js');
const User = require('../models/User');


notesCtrl.getNotes =  async (req, res) => {
    

        try {
                console.log('loaded notes... ');

                const h_user = req.headers['user'];
                const h_title = String( req.headers['title'] ).trim();
            
                const notes = await Note.find(
                    {
                        title: (h_title === '' || h_title === undefined ? { $ne: '' } : { '$regex':  h_title , '$options': 'i' }), 
                        $or : [   { userCreator: h_user }, { userAssigned: h_user } ]
                        
                    }
                    
                ).sort({date: -1});

                await User.populate(notes, {path: 'userCreator' , select: { '_id': 1,'username':1}});
                await User.populate(notes, {path: 'userAssigned' , select: { '_id': 1,'username':1 , 'image_url':1}});
                
                res.status(200).send(notes);
        }
        catch (err) {
            res.status(400).json({
                error: err
            });
        }
};


notesCtrl.createNote = async (req, res) => {

    try {

            const { title, content, userCreator, userAssigned, made, priority, date } = req.body;
            console.log('userCreator:',userCreator, '\n userAssigned:', userAssigned);
            const notes = await Note.find(
                {
                        title :  title , 
                        $and : [   { userCreator: userCreator }, { userAssigned: userAssigned } ]
                }
            ).limit(1)
            
            let _msg = 'New Note added!';
            
            if(notes.length === 0){
                const newNote = new Note({
                    title,
                    content,
                    userCreator,
                    userAssigned,
                    made,
                    priority,
                    date
                });
            
                await newNote.save();
                res.json({msg:_msg, title:newNote.title, path:'/notes'});
            }else{
                _msg = 'The note already exists.'
                res.json({msg:_msg, title:title, path:'/create'});
            }
    }
    catch (err) {
        res.status(400).json({
            error: err
        });
    }
};

notesCtrl.getNote = async (req, res) => {

    try{
        const note = await Note.findById(req.params.id);
        res.json(note);
    }
    catch (err) {
        res.status(400).json({
            error: err
        });
    }
}

notesCtrl.deleteNote = async (req, res) => {

    try{
        await Note.findByIdAndDelete(req.params.id)
        let _msg = 'Deleted note!';
        res.json({msg:_msg});
    }
    catch (err) {
        res.status(400).json({
            error: err
        });
    }
}

notesCtrl.updateNote = async (req, res) => {

    try{
       
        let _msg = 'Updated note!';
        _path = '/notes';
        const { title, content, userCreator, userAssigned, made, priority, date } = req.body;
        
        if(!title || title === undefined){

            _msg = 'Note Made!';
           
            await Note.findByIdAndUpdate(
                {_id: req.params.id} ,
                { 
                    $set: { made: true}
                }
            );
    
        }
        else{

            const notes = await Note.find(
                {
                    _id: { $ne: req.params.id },
                    title :  title , 
                    $and : [   { userCreator: userCreator }, { userAssigned: userAssigned } ]
                   
                }
            ).limit(1)
            
            console.log('userCreator:',userCreator, '\n userAssigned:', userAssigned,'\n req.params.id:',req.params.id, '\n title:',title);
            console.log('notes:',notes);

            if(notes.length === 0){
                await Note.findByIdAndUpdate(req.params.id, {
                    title,
                    content,
                    userCreator,
                    userAssigned,
                    made,
                    priority,
                    date
                });
            }else{
                _msg = 'The note already exists.'
                _path = '/edit/'+req.params.id;
            }
        }
        res.json({msg:_msg, title:title, path:_path});
    }
    catch (err) {
        res.status(400).json({
            error: err
        });
    }
}



module.exports = notesCtrl;