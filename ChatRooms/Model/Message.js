const Database = require("../Database/dbaccess");
var mongo = require('mongodb');
const moment = require('moment-timezone');
async function Message(req,res){
    try{
        let reqSeq = {
            collection: req.ChatRoomId,
            key: "ID"
        }
        // console.log(reqSeq);
        let Seq = await Database.GetCollectionSequence(reqSeq);
        var o_id = new mongo.ObjectID(req.data.id);
        var Data = {
            collection: req.ChatRoomId,
            data: {
                ID: Seq.SequenceID,
                UserID: o_id,
                Avatar: req.data.userName.charAt(0),
                Type: "text",
                Text: req.data.text,
                TimeStamp: moment().tz("Asia/Colombo").format()   
            }
        }
        let resp = await Database.InsertAccess(Data);
        // console.log(resp);
        let RespData = Data.data;
        Data.TimeStamp = moment().tz("Asia/Colombo").format('h:mm a');
        return(RespData);
    }catch(error){
        return({respCode:500,respText:error.message});
    }
}
exports.Message = Message;