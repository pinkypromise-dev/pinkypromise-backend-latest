var jwt = require('jsonwebtoken');
var config = require('./config');

async function VerifyJWT(token){
    if (!token){
        return({ auth: false, message: 'No token provided.' });
    }else{
        var Data = await jwt.verify(token, config.secret, (err, Info) => {
            if (err) {
                return({status: 401, message: "Invalid Token or Token expired!"});
            }else{
                return({status: 200, message: "success", data: Info});
            }
        });
        return(Data);
    }
}
exports.VerifyJWT=VerifyJWT;
