const getMessages = require('../Model/getMessages');
const getMyChatRooms = require("../Model/getMyChatRooms");
const getUserChatRooms = require("../Model/getUserChatRooms");
const UpdateChatRoomActivity = require("../Model/UpdateChatRoomActivity");
const updateUserChatRooms = require("../Model/updateUserChatRooms");
const getListChatRooms = require("../Model/getListChatRooms");
const SocketConnectionTesting = require("../Model/SocketConnectionTesting");

async function Routing(req,res){
    try{
        let func = null;
        switch((req.path).split("/").pop()){
            case "getMessages":
                func = getMessages.processInput;
                break;
            case "getMyChatRooms":
                func = getMyChatRooms.processInput;
                break;
            case "getUserChatRooms":
                func = getUserChatRooms.processInput;
                break;
            case "UpdateChatRoomActivity":
                func = UpdateChatRoomActivity.processInput;
                break;
            case "updateUserChatRooms":
                func = updateUserChatRooms.processInput;
                break;
            case "getListChatRooms":
                func = getListChatRooms.processInput;
                break;
            case "SocketConnectionTesting":
                func = SocketConnectionTesting.processInput;
                break;
            default:
                func = null;
                break;
        }
        let processResponse = await func(req.body,res);
        res.send(processResponse); 
    }catch(error){
        console.log(error.message)
        res.send({status:500,message:"Invalid API Endpoint"});
    }
}
exports.Routing=Routing;