var mongoose = require('mongoose');
mongoose.connect('mongodb://xx:xx@xx:xx/xx?authSource=admin', {
    useMongoClient: true, config: {autoIndex: false}
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongodb init success!");
});