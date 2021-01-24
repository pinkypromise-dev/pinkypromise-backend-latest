const Database = require("../Database/dbaccess");
async function getMessages(req,res){
    try{
      if((req.ChatRoomId === null || req.ChatRoomId === undefined ||  req.ChatRoomId === "") && (req.LastMsgId === null || req.LastMsgId === undefined || req.LastMsgId === "")){
        return({status:404,message:"ChatRoomId/LastMsgId is missing in request"});
      }else{
        var QueryDataSet = {
            collection: req.ChatRoomId,
            query: {ID: {$lte: parseInt(req.LastMsgId)}},
            Project: true,
            ProjectData: {ID:1,UserID:1,_id:0,Avatar:1,Type:1,Text:1},
            Limit: true,
            LimitValue: 25,
            Sort: true,
            SortQuery: {ID: -1}
        }
        var Response = await Database.GetAccess(QueryDataSet);
	let Data = Response.sort((Obj,Obj1)=>Obj.ID-Obj1.ID);
        if(Response.length > 0){
          return({status:200,message:"success",data: Data});
        }else{
          return({status:404,message:"Data Not Found"});
        }
      }
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = getMessages;
