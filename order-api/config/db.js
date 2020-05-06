const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let dbUrl = 'mongodb://192.168.99.100:27017/app';
const connection = mongoose.connect(dbUrl, {useNewUrlParser: true}).then(
    () => {
        console.log('Database is connected')
    },
    err => {
        console.log('Can not connect to the database' + err)
    }
);

module.exports.connection = connection;