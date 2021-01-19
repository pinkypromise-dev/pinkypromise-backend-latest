const Database = require("../Database/dbaccess");
var mongo = require('mongodb');
async function getMyChatRooms(req,res){
    try{
        if(req.userID === null || req.userID === undefined){
            return({status:404,message:"userID is missing in request"});
        }else{
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
            var UserChatRooms = await Database.GetAccess(QueryDataSet);
            if(UserChatRooms.length === 0){
                return({status: 404, message:"User Not Found"});
            }else{
                if(UserChatRooms[0].chatroomperference.length >0){
                    let ChatRooms = UserChatRooms[0].chatroomperference.filter((Data,Index)=>{return(Data.Active)})
                    if(ChatRooms === 0){
                        return({status: 404, message:"No ChatRooms Initiated"});
                    }else{
                        ChatRooms.sort(function(a, b){return a.Priority - b.Priority});
                        let FinalResultSet = [];
                        for(let i=0;i<ChatRooms.length;i++){
                            var ForQueryDataSet = {
                                collection: "ChatRoomMaster",
                                query: {
                                    ID: ChatRooms[i].InfoID
                                },
                                Project: false,
                                ProjectData: {},
                                Limit: false,
                                LimitValue: 25,
                                Sort: false,
                                SortQuery: {ID: 1}
                            }
                            var DataSet = await Database.GetAccess(ForQueryDataSet);
                            var MessageReq = {
                                collection: DataSet[0].ChatRoomID,
                                query: {},
                                Project: true,
                                ProjectData: {Text:1,_id:0},
                                Limit: true,
                                LimitValue: 1,
                                Sort: true,
                                SortQuery: {ID: -1}
                            }
                            var LatestMessage = await Database.GetAccess(MessageReq); // get latest message on chatroom
                            let reqData = {
                                collection: DataSet[0].ChatRoomID,
                                query:{ID:{$gt: ChatRooms[i].LatSeenMessageID}}
                            }
                            let UnreadCount = await Database.CountAccess(reqData); // Get user unread messages count
                            let FinalDataObj = {
                                ChatRoomName: DataSet[0].Name,
                                ChatRoomID: DataSet[0].ChatRoomID,
                                LatestMessage: LatestMessage.length>0?LatestMessage[0].Text:null,
                                LastSeenMessageID: ChatRooms[i].LatSeenMessageID,
                                UnreadCount:  UnreadCount,
                                Avatar: DataSet[0].Avatar            
                            }
                            FinalResultSet.push(FinalDataObj);
                        }
                        return({status: 200, message:"success", ChatRoomsInfo: FinalResultSet});
                    }
                }else{
                    return({status: 404, message:"error", respText: "User not in any Chatrroms", ChatList: []});   
                }
            }
        }
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = getMyChatRooms;