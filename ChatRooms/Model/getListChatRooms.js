const Database = require("../Database/dbaccess");
async function getListChatRooms(req,res){
    try{
        var QueryDataSet = {
            collection: "ChatRoomMaster",
            query: {},
            Project: false,
            ProjectData: {},
            Limit: false,
            LimitValue: 25,
            Sort: false,
            SortQuery: {ID: 1}
        }
        var ChatRoomsList = await Database.GetAccess(QueryDataSet);
        if(ChatRoomsList.length === 0){
            return({status: 404, message:"error", respText: "Data Not Found"});
        }else{
            return({status: 200, message:"success", ChatRooms: ChatRoomsList});
        }
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = getListChatRooms;