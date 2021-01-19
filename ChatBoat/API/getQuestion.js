const Database = require("../Database/dbaccess");
async function getQuestion(req,res){
    try{
        if((req.QID === null || req.QID === undefined ||  req.QID === "") && (req.TID === null || req.TID === undefined ||  req.TID === "")){
            return({status:404,message:"QID/TID is missing in request"});
        }else{
            let QID = parseInt(req.QID);
            let TID = parseInt(req.TID)
            var QueryDataSet = {
                collection: "QuestionsMaster",
                query: {QID:QID, TID:TID},
                Project: true,
                ProjectData: {_id:0},
                Limit: false,
                LimitValue: 1,
                Sort: false,
                SortQuery: {TID: 1}
            }
            var Response = await Database.GetAccess(QueryDataSet);
            if(Response.length > 0){
                let ResponseData = Response[0];
                for(let s=0;s<ResponseData.Options.length;s++){
                    ResponseData.Options[s].RefType = "";
                }
                if(QID === 18){
                    let SelectedOptions= req.SelectedOptions;
                    let CondQue = SelectedOptions.filter((Data,Index)=>{
                        return(Data.QID === 17)
                    })
                    if(ResponseData.Options[0].ID === 1 && CondQue[0].ID === 1){
                        ResponseData.Options[0].NextRef = 9;
                    }else if(ResponseData.Options[0].ID === 1 && CondQue[0].ID === 2){
                        ResponseData.Options[0].NextRef = 10;
                    }
                    if(ResponseData.Options[1].ID === 2 && CondQue[0].ID === 1){
                        ResponseData.Options[1].NextRef = 11;
                    }else if(ResponseData.Options[1].ID === 2 && CondQue[0].ID === 2){
                        ResponseData.Options[1].NextRef = 12;
                    }
                }else if(QID === 21 && TID === 2){ //Morning After
                    // Only When age is greater then 70
                    if(false){
                        for(let i=0;i<ResponseData.Options.length;i++){
                            ResponseData.Options[i].RefType = "Diagnostic Result";
                            ResponseData.Options[1].NextRef = -1;
                        }
                    }
                }else if(QID === 26 && TID === 4){ // UTI
                    let UTI=false;
                    let PossibleUTI=false;
                    let RecurrentUTI=false;
                    let NoUTI=false;

                    let SelectedOptions= req.SelectedOptions;
                    // Condition 1
                    let CondQue = SelectedOptions.filter((Data,Index)=>{
                        return(Data.QID === 22)
                    })
                    if(CondQue.length > 0){
                        let CondOpt = CondQue[0].data.filter((Data,Index)=>{
                            return(Data.ID === 5)
                        })
                        if(CondOpt.length > 0){
                            UTI = false;
                        }else{
                            UTI = true;
                        }
                        // Condition 2, 3, 4 and 6
                        if(UTI){
                            let CondQue1 = SelectedOptions.filter((Data,Index)=>{
                                return(Data.QID === 23)
                            })
                            if(CondQue1.length > 0){
                                let CondOpt1 = CondQue1[0].data.filter((Data,Index)=>{
                                    return(Data.ID === 4)
                                })
                                // Condition 2
                                if(CondOpt1.length > 0){
                                    PossibleUTI = false;
                                }else{
                                    PossibleUTI = true;
                                }
                                // Condition 3
                                let CondOpt2 = CondQue1[0].data.filter((Data,Index)=>{
                                    return(Data.ID === 1 || Data.ID === 2 || Data.ID === 3)
                                })
                                if(CondOpt2.length > 1){
                                    let CondOpt3 = CondOpt2.filter((Data,Index)=>{
                                        return(Data.ID === 3)
                                    }) 
                                    if(CondOpt3.length > 0){
                                        UTI = true
                                    }
                                }
                                // Condition 4
                                let CondOpt41 = CondOpt2.filter((Data,Index)=>{
                                    return(Data.ID === 1 || Data.ID === 2)
                                })
                                let CondOpt42 = CondOpt2.filter((Data,Index)=>{
                                    return(Data.ID === 1 || Data.ID === 3)
                                })
                                let CondOpt43 = CondOpt2.filter((Data,Index)=>{
                                    return(Data.ID === 2 || Data.ID === 3)
                                })
                                if(CondOpt41.length === 2 || CondOpt42.length === 2 || CondOpt43.length === 2){
                                    PossibleUTI = true;
                                }
                                // Condition 6
                                if(CondOpt1.length === 1)   {
                                    NoUTI = true;
                                }
                            }else{
                                // return({status:404, message:"Data Not Found"});
                            }
                        }
                        // Condition-5
                        let CondQue5 = SelectedOptions.filter((Data,Index)=>{
                            return(Data.QID === 25)
                        })
                        if(CondQue5.length > 0){
                            if(CondQue5[0].ID === 2){
                                if(ResponseData.Options[0].ID === 1){ //Q26 => yes
                                    RecurrentUTI = true;
                                    if(UTI == true && RecurrentUTI == true){
                                        ResponseData.Options[0].NextRef=20; //UTI + RecurrentUTI
                                    }else if(PossibleUTI == true && RecurrentUTI == true){
                                        ResponseData.Options[0].NextRef=19; //PossibleUTI + RecurrentUTI
                                    }else{
                                        ResponseData.Options[0].NextRef=18;
                                    }
                                }
                            }else{
                                ResponseData.Options[0].NextRef=18; //this is missed
                            }
                        }else{
                            if(UTI){
                                ResponseData.Options[0].NextRef=18;
                            }else if(PossibleUTI){
                                ResponseData.Options[0].NextRef=17;
                            }else if(NoUTI){
                                ResponseData.Options[0].NextRef=16
                            }
                        }
                        if(UTI){
                            ResponseData.Options[1].NextRef=18;
                        }else if(PossibleUTI){
                            ResponseData.Options[1].NextRef=17;
                        }else if(NoUTI){
                            ResponseData.Options[1].NextRef=16;
                        }
                    }else{
                        return({status:404, message:"Data Not Found"});
                    }
                }
                return({status:200, message:"success",data: ResponseData});
            }else{
                return({status:404, message:"Data Not Found"});
            }
        }
    }catch(error){
        return({status:400,message:error.message});
    }
}
exports.processInput = getQuestion;
