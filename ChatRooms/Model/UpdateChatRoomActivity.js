const Database = require("../Database/dbaccess");
var mongo = require('mongodb');
async function UpdateChatRoomActivity(req,res){ // UserChatRoomsList
    try{
        // console.log(req)
        if((req.userID === null || req.userID === undefined) && (req.ChatRoomID === null || req.ChatRoomID === undefined) && (req.LastSeenMessageID === null || req.LastSeenMessageID === undefined)){
            return({status:404,message:"userID/ChatRoomID/LastSeenMessageID is missing in request"});
        }else{
            // userID,ChatRoomID,LastSeenMessageID
            var O_Id = new mongo.ObjectID(req.userID);
            var QueryDataSet = {
                collection: "userdetails",
                query: {"_id": O_Id},
                Project: true,
                ProjectData: {chatroomperference:1},
                Limit: false,
                LimitValue: 25,
                Sort: false,
                SortQuery: {"_id": 1}
            }
            var Response = await Database.GetAccess(QueryDataSet);
            if(Response.length > 0){
                let Modified = 0;
                let dataSet = Response[0].chatroomperference;
                for(let i=0;i<dataSet.length;i++){
                    if(dataSet[i].ChatRoomID === req.ChatRoomID){
                        dataSet[i].LatSeenMessageID = parseInt(req.LastSeenMessageID);
                        Modified=1;
                    }
                }
                if(Modified === 0){
                    return({status:404,message:"Invalid ChatRoomID"});
                }else{
                    var QueryDataSet = {
                        collection: "userdetails",
                        UpdateQuery: {"_id": O_Id}, //req.userID},
                        data: {chatroomperference: dataSet}
                    }
                    var Response = await Database.UpdateAccess(QueryDataSet);
                    if(Response.result.n === 1){
                        return({status:200,message:"success"});
                    }else{
                        return({status:404,message:"Data not updated successfully"});
                    }
                }
            }else{
                return({status:404,message:"Data Not Found"});
            }
        }
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = UpdateChatRoomActivity;
