const mongoose = require('mongoose')
const { logger } = require('../util');
// require('dotenv').config({ path: 'G:/New Free/pinkypromise/env' });
// require('dotenv').config({ path: '/home/ec2-user/insurex_backend/insurex/env' });




let db = mongoose.connect("mongodb+srv://pinkypromisedev:pinkypromise123@@pinkypromise-dev.1yain.mongodb.net/PinkyPromise", {useCreateIndex: true, useNewUrlParser: true}, function (err) {

if (err) throw err;  
logger.log("Successfully connected with MongoDB")



});
module.exports = {
    db
};
