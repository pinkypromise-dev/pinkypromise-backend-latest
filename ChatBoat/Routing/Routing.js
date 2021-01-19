const getListTopics = require('../API/getListTopics');
const getQuestion = require("../API/getQuestion");
const getDiagnosticResult = require("../API/getDiagnosticResult");

async function Routing(req,res){
    try{
        let func = null;
        switch((req.path).split("/").pop()){
            case "getListTopics":
                func = getListTopics.processInput;
                break;
            case "getQuestion":
                func = getQuestion.processInput;
                break;
            case "getDiagnosticResult":
                func = getDiagnosticResult.processInput;
                break;
            default:
                func = null;
                break;
        }
        let processResponse = await func(req.body);
        res.send(processResponse); 
    }catch(error){
        console.log(error)
        res.send({status:500,message:"Invalid API Endpoint"});
    }
}
exports.Routing=Routing;