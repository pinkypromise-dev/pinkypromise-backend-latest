const Database = require("../Database/dbaccess");
async function getListTopics(req,res){
    try{
        var QueryDataSet = {
            collection: "Topics",
            query: {},
            Project: true,
            ProjectData: {TID:1,Topic:1,TopicHeader:1,IntroMessages:1,RefID:1,Icon:1,_id:0},
            Limit: false,
            LimitValue: 1,
            Sort: true,
            SortQuery: {Order: 1}
        }
        var Response = await Database.GetAccess(QueryDataSet);
        if(Response.length > 0){
          return({status:200, message:"success",data: Response});
        }else{
          return({status:404, message:"Data Not Found"});
        }
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = getListTopics;
