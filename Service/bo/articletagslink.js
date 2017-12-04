var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//实体对象
module.exports = Schema(
    {
        tag_id: String,
        article_id: String
    },
    {
        timestamps: {createdAt: 'createtime', updatedAt: 'updatetime'}
    });