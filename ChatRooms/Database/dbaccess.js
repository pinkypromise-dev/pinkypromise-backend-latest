const URL = "mongodb+srv://pinkypromisedev:pinkypromise123@@pinkypromise-dev.1yain.mongodb.net";
const MongoClient = require('mongodb').MongoClient;
const Mongo = new MongoClient(URL, { useNewUrlParser: true});
Mongo.connect().catch(function(error){console.log("Failed to connect to MongoDB server")});

async function InsertAccess(req){
    try{
        let response = await Mongo.db('PinkyPromise').collection(req.collection).insertOne(req.data);
        return(response);
    }catch(error){
        return({respCode: 400, respText: "error", message: error.message});
    }
}
exports.InsertAccess=InsertAccess;

async function UpdateAccess(req){
    try{
        var response = await Mongo.db('PinkyPromise').collection(req.collection).updateOne(req.UpdateQuery,{$set: req.data});
        return(response);
    }catch(error){
        return({respCode: 400, respText: "error", message: error.message});
    }
}
exports.UpdateAccess=UpdateAccess;

async function GetAccess(req){
    try{
        if(req.Sort === false){
            if(req.Project === true && req.Limit === true){
                let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).project(req.ProjectData).limit(req.LimitValue).toArray();
                return(response);    
            }else if(req.Project === true && req.Limit === false){
                let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).project(req.ProjectData).toArray();
                return(response);    
            }else if(req.Project === false && req.Limit === true){
                let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).limit(req.LimitValue).toArray();
                return(response);    
            }else if(req.Project === false && req.Limit === false){
                let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).toArray();
                return(response);    
            }else{
                // Not Decided Yet
            }
        }else{
            if(req.Project === true && req.Limit === true){
                let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).project(req.ProjectData).sort(req.SortQuery).limit(req.LimitValue).toArray();
                return(response);    
            }else if(req.Project === true && req.Limit === false){
                let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).project(req.ProjectData).sort(req.SortQuery).toArray();
                return(response);    
            }else if(req.Project === false && req.Limit === true){
                let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).sort(req.SortQuery).limit(req.LimitValue).toArray();
                return(response);    
            }else if(req.Project === false && req.Limit === false){
                let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).sort(req.SortQuery).toArray();
                return(response);    
            }else{
                // Not Decided Yet
            }
        }
    }catch(error){
        console.log(error);
        return({respCode: 400, respText: "error", message: error.message});
    }
}
exports.GetAccess=GetAccess;

async function GetCollectionSequence(req){
    try{
        var FindData = await Mongo.db('PinkyPromise').collection(req.collection).find({}).sort({[req.key]: -1}).limit(1).toArray();
        let SeqID = 1
        if(FindData.length > 0){
            SeqID = FindData[0].ID+1;
        }
        return({SequenceID: SeqID});
    }catch(error){
        return({respCode: 400, respText: "error", message: error.message});
    }
}
exports.GetCollectionSequence=GetCollectionSequence;

async function DeleteAccess(req){
    try{
        let response = await Mongo.db('PinkyPromise').collection(req.collection).deleteOne(req.query);
        return(response);
    }catch(error){
        return({respCode: 400, respText: "error", message: error.message});
    }
}
exports.DeleteAccess=DeleteAccess;


async function DeleteAccess(req){
    try{
        let response = await Mongo.db('PinkyPromise').collection(req.collection).deleteOne(req.query);
        return(response);
    }catch(error){
        return({respCode: 400, respText: "error", message: error.message});
    }
}
exports.DeleteAccess=DeleteAccess;

async function CountAccess(req){
    try{
        let response = await Mongo.db('PinkyPromise').collection(req.collection).find(req.query).count();
        return(response);
    }catch(error){
        return({respCode: 400, respText: "error", message: error.message});
    }
}
exports.CountAccess=CountAccess;
