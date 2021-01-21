const {getListLiveUsers} = require('../utils/users');
async function getLiveUsers(req,res){
    try{
        return({status:200,message:"success",data: getListLiveUsers()});
    }
    catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = getLiveUsers;
    