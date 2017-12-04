var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//实体对象
module.exports = Schema(
    {
        _id: String,
        title: String,
        markdown: String,
        previewedHTML: String,
        viewnum: Number,
        author: String,
        ispublished: String,
        classify_name: String,
        classify_id: String,
        lives: String
    },
    {
        timestamps: {createdAt: 'createtime', updatedAt: 'updatetime'}
    });