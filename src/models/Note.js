const { Schema, model } = require('mongoose');
const user = model('User');

const noteSchema = new Schema(
    {
        title: { type: String, required: true},
        content: { type: String, required: true},
        userCreator:   { type: Schema.ObjectId, ref: 'user' },
        userAssigned: { type: Schema.ObjectId, ref: 'user' },
        made: {type: Boolean, value:false},
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"]
        },
        date: Date
    }, {
        timestamps: true
    });

module.exports = model('Note', noteSchema);