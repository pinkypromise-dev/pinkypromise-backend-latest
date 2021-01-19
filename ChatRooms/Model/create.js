var jwt = require('jsonwebtoken');
var config = require('../utils/authentication/config');

async function create(req,res){
    return({Token: jwt.sign({data: 'foobar'}, config.secret, { expiresIn: 60 * 60 })});
}
exports.create=create;
