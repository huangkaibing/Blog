var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//实体对象
module.exports = Schema(
    {
        _id: String,
        name: String
    },
    {
        timestamps: {createdAt: 'createtime', updatedAt: 'updatetime'}
    });