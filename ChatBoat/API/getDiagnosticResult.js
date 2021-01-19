const Database = require("../Database/dbaccess");
async function getDiagnosticResult(req,res){
    try{
        if((req.MsgId === null || req.MsgId === undefined ||  req.MsgId === "") && (req.TID === null || req.TID === undefined ||  req.TID === "")){
            return({status:404,message:"MsgId/TID is missing in request"});
        }else{
            let TID = parseInt(req.TID)
            if(req.RefType === null || req.RefType === undefined || req.RefType === ""){
                let MsgId = parseInt(req.MsgId);
                var QueryDataSet = {
                    collection: "DestinationMessages",
                    query: {MsgId:MsgId, TID:TID},
                    Project: true,
                    ProjectData: {_id:0,Category:0},
                    Limit: false,
                    LimitValue: 1,
                    Sort: false,
                    SortQuery: {TID: 1}
                }
                var Response = await Database.GetAccess(QueryDataSet);
                if(Response.length > 0){
                    return({status:200, message:"success",data: Response[0]});
                }else{
                    return({status:404, message:"Data Not Found"});
                }
            }else{
                let MsgId = req.MsgId.split(",");
                for(let i=0;i<MsgId.length;i++){
                    MsgId[i] = parseInt(MsgId[i]);
                }
                let RefType = req.RefType;
                if(RefType === "Diagnostic Result"){
                    var QueryDataSet = {
                        collection: "DiagnosticResult",
                        query: {ID:{ $in: MsgId}, TID:TID},
                        Project: true,
                        ProjectData: {_id:0,Category:0},
                        Limit: false,
                        LimitValue: 1,
                        Sort: false,
                        SortQuery: {TID: 1}
                    }
                    var Response = await Database.GetAccess(QueryDataSet);
                    for(let j=0;j<Response.length;j++){
                        Response[j].MainMessage = 'In your case '+Response[j].Name+' may be a good fit" - Learn more!"'
                    }
                    if(Response.length > 0){
                        return({status:200, message:"success",data: Response});
                    }else{
                        return({status:404, message:"Data Not Found"});
                    }
                }else{
                    return({status:404, message:"Functionality under development....!"});
                }
            }
        }
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = getDiagnosticResult;
