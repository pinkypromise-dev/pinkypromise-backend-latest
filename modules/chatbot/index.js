const express = require('express');
const router = express.Router();
const chatbotController = require('./controller/chatbotcontroller');
const middleware = require('../middlewares/authMiddleware')

router.get('/chatbottopic', chatbotController.getchatbottopicmenu)
router.post('/desc', chatbotController.getCategoryDesc)
router.post('/getquestionlist', chatbotController.getQuestionList)
router.post('/result', chatbotController.result)
router.post('/getfulldesc',chatbotController.getcatfulldescription)
module.exports = router