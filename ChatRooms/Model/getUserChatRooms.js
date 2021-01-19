const Database = require("../Database/dbaccess");
var mongo = require('mongodb');
async function getUserChatRooms(req,res){
    try{
        if(req.userID === null || req.userID === undefined){
            return({status:404,message:"userID is missing in request"});
        }else{
            var o_id = new mongo.ObjectID(req.userID);
            var QueryDataSet = {
                collection: "userdetails",
                query: {"_id": o_id},
                Project: true,
                ProjectData: {chatroomperference:1},
                Limit: false,
                LimitValue: 25,
                Sort: false,
                SortQuery: {"_id": 1}
            }
            var Response = await Database.GetAccess(QueryDataSet);
            if(Response.length > 0){
                return({status: 200, message:"success",data: Response[0]});
            }else{
                return({status: 404, message:"Data Not Found",data: Response});
            }
        }
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = getUserChatRooms;
