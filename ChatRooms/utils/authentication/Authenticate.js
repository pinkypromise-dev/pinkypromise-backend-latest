const Database = require("../../Database/dbaccess");
const Verification = require("./verification");
async function UserAuthenticate(token){
    try{
        let Info = await Verification.VerifyJWT(token);
        return(Info);
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.UserAuthenticate=UserAuthenticate;
