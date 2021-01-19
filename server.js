// require('dotenv').config({ path: 'G:/New Free/pinkypromise/env' });
const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');
const { init } = require('@sentry/node');
const cors = require('cors');
const app = express();
const { logger } = require('./util');
const routes = require('./routes');
const mongolib = require('./mongoLib/index')

const Authenticate = require ('./ChatBoat/utils/authentication/Authenticate');

const ChatBoatDB = require('./ChatBoat/Database/dbaccess');
const API_Routing_ChatBoat = require('./ChatBoat/Routing/Routing')
const getDiagnosis = require('./ChatBoat/ByHarshil/getDiagnosis'); // By harshil
const getQuestion = require('./ChatBoat/ByHarshil/getQuestion'); // By harshil

const ChatRoomsDB = require('./ChatRooms/Database/dbaccess');
const API_Routing_ChatRooms = require('./ChatRooms/Routing/Routing')
const {SocketService} = require('./ChatRooms/utils/SocketService');

app.set('port', 5000);
app.use(cors());
app.use(express.static(path.join(__dirname, 'Files/Images'))); //ChatBoat/ChatRooms image icons access from server


app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,access_token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use('/api/v1', routes);
// app.get('/api/v1', (req, res) => {
//     res.send("Hello world");
// });
// app.use('/', indexRouter); 

//By Harshil getDiagnosis,getQuestion
app.get('/ChatBoat1/getDiagnosis', getDiagnosis.processInput);
app.post('/ChatBoat1/getDiagnosis', getDiagnosis.processInput);
app.get('/ChatBoat1/getQuestion', getQuestion.processInput);
app.post('/ChatBoat1/getQuestion', getQuestion.processInput);

app.get('/ChatBoat/*',processRequest);
app.post('/ChatBoat/*',processRequest);

app.get('/ChatRooms/*',ChatRoomsprocessRequest);
app.post('/ChatRooms/*',ChatRoomsprocessRequest);

app.get('/TESTING',TESTING);

logger.log('App Environment is: ', app.get('env'));

const server = http.createServer(app);

/** Creating socket connection */
global.io = socketio(server,{cors: {origin: '*'} });
global.io.on('connection', SocketService);


server.listen(app.get('port'), () => {
    console.log('App is running on port: ', app.get('port'));
});

async function processRequest(req,res){
    try {
        // // JWT Authentication
        // let JWTToken = req.body.Token;
        // let Response = await Authenticate.UserAuthenticate(JWTToken);
        // if(Response.status === 200){
            await API_Routing_ChatBoat.Routing(req,res);
        // }else{
        //     res.send(Response);
        // }
    } catch (error) {
        res.send({status:400, message: error.message});
    }
}

async function TESTING(req,res){
    try{
        const moment = require('moment-timezone');
        res.send({status:200, currentTimeStamp:moment().tz("Asia/Colombo").format(),Time:moment().tz("Asia/Colombo").format('h:mm a')});   
    }catch(error){
        res.send({status:400, message: error.message});   
    }
}

async function ChatRoomsprocessRequest(req,res){
    try {
        // // JWT Authentication
        // let JWTToken = req.body.Token;
        // let Response = await Authenticate.UserAuthenticate(JWTToken);
        // if(Response.status === 200){
            await API_Routing_ChatRooms.Routing(req,res);
        // }else{
        //     res.send(Response);
        // }
    } catch (error) {
        res.send({status:400, message: error.message});
    }
}


const used = process.memoryUsage().heapUsed / 1024 / 1024;
const available = process.memoryUsage().heapTotal / 1024 / 1024;
logger.log(`The approximately available memory is: ${Math.round(available * 100) / 100} MB`);
logger.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
