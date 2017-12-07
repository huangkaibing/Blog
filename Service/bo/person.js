var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//实体对象
module.exports = Schema(
    {
        usr: String,
        pwd: String
    },
    {
        timestamps: {createdAt: 'createtime', updatedAt: 'updatetime'}
    });