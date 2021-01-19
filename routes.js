const { Router } = require('express');
const router = Router();
const user=require('./modules/users')
const chatbot=require('./modules/chatbot')
 router.use('/user',user)
 router.use('/chat',chatbot)
module.exports = router;
