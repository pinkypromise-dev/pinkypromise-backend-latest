var mongo = require('mongodb');
const Database = require("../Database/dbaccess");
async function updateUserChatRooms(req,res){
  try{
    if((req.userID === null || req.userID === undefined) && (req.data === null || req.data === undefined)){
      return({status:404,message:"userID/data is missing in request"});
    }else{
      var o_id = new mongo.ObjectID(req.userID);
      let Data = req.data;

      // Reseting LastSeen Message ID when user Re-Joins
      for(let i=0; i<Data.length; i++){
        if(Data[i].Active === true){
          // Verifying updated data
          var QueryDataSet = {collection: "userdetails",query: {"_id": o_id},Project: true,ProjectData: {chatroomperference:1},Limit: false,LimitValue: 25,Sort: false,SortQuery: {"_id": 1}}
          var UserChatRooms = await Database.GetAccess(QueryDataSet);
          if(UserChatRooms.length > 0){ //getting existing data
            if(UserChatRooms[0].chatroomperference.length >0){  //getting existing data OF CHAT ROOMS
              let FilterDataSet = UserChatRooms[0].chatroomperference.filter((Data,Index)=>{return(Data.Active === false)}); // fILTERING iNACTIVE CHAT ROOMS
              if(FilterDataSet.length > 0){
                // HERE GOING TO CHANGE INACTIVE ACTIVE FOR AN CHAT ROOM
                var QueryDataSet = {collection: req.ChatRoomId,query: {},Project: true,ProjectData: {ID:1,UserID:1},Limit: true,LimitValue: 1,Sort: true,SortQuery: {ID: -1}}
                var Response = await Database.GetAccess(QueryDataSet);
                if(Response.length > 0){
                  Data[i].LatSeenMessageID = Response[0].ID;
                }
              }
            }  
          }
        }
      }

      var QueryDataSet = {
        collection: "userdetails",
        UpdateQuery: {"_id": o_id},
        data: {chatroomperference: Data}
      }
      var Response = await Database.UpdateAccess(QueryDataSet);
      if(Response.result.n === 1){
        return({status:200,message:"success"});
      }else{
        return({status:404,message:"Data not updated successfully"});
      }
    }
  }catch(error){
    return({status:400,message:error.message});
  }
}
exports.processInput = updateUserChatRooms;
