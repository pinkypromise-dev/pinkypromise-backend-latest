const {ConnectedList} = require('../utils/users');

async function SocketConnectionTesting(req,res){
    return(await ConnectedList());
}
exports.processInput=SocketConnectionTesting;
