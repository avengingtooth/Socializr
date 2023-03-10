const { Schema, model } = require("mongoose");

const tagSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    }
});

const Tag = model('Tag', tagSchema);

module.exports = Tag;
