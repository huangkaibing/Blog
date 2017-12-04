var mongoose = require('mongoose');
mongoose.connect('mongodb://root:huangkb@47.96.165.91:27017/test?authSource=admin', {
    useMongoClient: true, config: {autoIndex: false}
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongodb init success!");
});