const chatbottopicmenu = require('../model/chatbottopicmenu')
const question = require('../model/question')
const userDetails = require('../../users/model/userDetails')
const Validator = require('../../../util/validation').validate_all_request;
const categorydesc = require('../model/moredescriptionofcategory')
const {
    logger,
    responses,
    constants,
    commonFunctions
} = require('../../../util');
const getchatbottopicmenu = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    chatbottopicmenu.find({}, (error, resupdate) => {
        if (error) {
            return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
        } else if (resupdate.length < 1) {
            return responses.sendError(res, languageCode, {}, "No List Found", constants.responseMessageCode.NO_DATA_FOUND)
        }
        else {
            return responses.actionCompleteResponse(res, languageCode, resupdate, "List SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
        }
    })
}
const getCategoryDesc = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['categoryid'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        let categoryid = req.body.categoryid
        chatbottopicmenu.findOne({ _id: categoryid }, (err, desc) => {
            if (err) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            }
            else if (!desc) {
                return responses.sendError(res, languageCode, {}, "No List Found", constants.responseMessageCode.NO_DATA_FOUND)
            }
            else {
                return responses.actionCompleteResponse(res, languageCode, desc, "Question Answer List SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
            }
        })
    }
}
const getQuestionList = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['categoryid'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        let categoryid = req.body.categoryid
        question.findOne({ categoryid: categoryid }, (err, questionanswerlist) => {
            if (err) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            }
            else if (!questionanswerlist) {
                return responses.sendError(res, languageCode, {}, "No List Found", constants.responseMessageCode.NO_DATA_FOUND)
            }
            else {
                return responses.actionCompleteResponse(res, languageCode, questionanswerlist, "Question Answer List SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
            }
        })
    }
}
const result = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['categoryid', 'answerlist'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        let ans = req.body.answerlist
        question.findOne({ categoryid: req.body.categoryid }, (err, resultlist) => {
            if (err) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else {
                let totalsumweightage = resultlist.quetionlist.length * 10
                let sum = 0
                let resdata = ''
                ans.forEach(element => {
                    sum = sum + element.weightage
                });
                totalweightage = (sum / totalsumweightage) * 100
                if (totalweightage > 60) {
                    resdata = resultlist.possibleresultList[0]
                }
                else if (totalweightage <= 59 && totalweightage > 30) {
                    resdata = resultlist.possibleresultList[1]
                }
                else {
                    resdata = resultlist.possibleresultList[2]
                }
                return responses.actionCompleteResponse(res, languageCode, resdata, "Desc", constants.responseMessageCode.ACTION_COMPLETE)
            }
        })
    }
}
const getcatfulldescription = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['categoryid'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        let categoryid = req.body.categoryid
        categorydesc.findOne({ categoryid: categoryid }).populate('categoryid').exec((err, desc) => {
            if (err) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            }
            else if (!desc) {
                return responses.sendError(res, languageCode, {}, "No List Found", constants.responseMessageCode.NO_DATA_FOUND)
            }
            else {
                return responses.actionCompleteResponse(res, languageCode, desc, "Full Desc", constants.responseMessageCode.ACTION_COMPLETE)
            }
        })
    }
}
module.exports = {
    getchatbottopicmenu,
    getQuestionList,
    getCategoryDesc,
    result,
    getcatfulldescription
}