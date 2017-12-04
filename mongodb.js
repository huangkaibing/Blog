var mongoose = require('mongoose');
mongoose.connect('mongodb://username:password@host:port/db?authSource=admin', {
    useMongoClient: true, config: {autoIndex: false}
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongodb初始化success!");
});