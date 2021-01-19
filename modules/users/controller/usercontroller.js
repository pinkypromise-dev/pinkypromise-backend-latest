const userDetails = require('../model/userDetails')
const Validator = require('../../../util/validation').validate_all_request;
const {
    logger,
    responses,
    constants,
    commonFunctions
} = require('../../../util');
const Bcrypt = require("bcryptjs");
const termsandprivacy = require('../model/termsprivacy')

//Sign API
const signup = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    if (req.body.IsSocialMedia) {
        userDetails.findOne({ socialmedialoginid: req.body.id }, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                req.body.socialmedialogintype = req.body.signuptype;
                req.body.socialmedialoginid = req.body.id;
                req.body.username = req.body.name;
                userDetails.create(req.body, (error, response) => {
                    if (error) {
                        if (error.code == "11000") {
                            return responses.sendError(res, languageCode, {}, "ALREADY_EXISTS", constants.responseMessageCode.EMAIL_ALREADY_EXISTS)
                        }
                        return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                    } else {
                        // const payload = {
                        //     userid: response._id
                        // };
                        // const accesstoken = commonFunctions.generateJWToken(payload)
                        // let data = {
                        //     userdata: response,
                        //     accesstoken: accesstoken
                        // }
                        return responses.actionCompleteResponse(res, languageCode, response, "SAVED SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                    }
                })
            }else{
                return responses.sendError(res, languageCode, {}, "ALREADY_EXISTS", constants.responseMessageCode.EMAIL_ALREADY_EXISTS)
                // const payload = {
                //     userid: resData._id
                // };
                // const accesstoken = commonFunctions.generateJWToken(payload)
                // let data = {
                //     userdata: resData,
                //     accesstoken: accesstoken
                // }
                // return responses.actionCompleteResponse(res, languageCode, data, "SAVED SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
            }
        })
    }else{
        let flag = Validator(req.body, ['email', 'password', 'acceptterms'])
        if (flag)
            return responses.sendError(res, languageCode, {}, flag[1], flag[0])
        else if (!req.body)
            return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
        else {
            userDetails.findOne({ email: req.body.email }, (err, resexists) => {
                if (err) {
                    return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                } else if (resexists) {
                    return responses.sendError(res, languageCode, {}, "ALREADY_EXISTS", constants.responseMessageCode.EMAIL_ALREADY_EXISTS)
                } else {
                    req.body.password = Bcrypt.hashSync(req.body.password, 10);
                    userDetails.create(req.body, (error, response) => {
                        console.log(error, response)
                        if (error) {
                            return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                        } else {
                            return responses.actionCompleteResponse(res, languageCode, response, "SAVED SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                        }
                    })
                }
            })
        }
    }
}

//Add or Update Default Language
const updatedefaultlanguage = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['defaultLanguage', 'userid'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        const userid = req.body.userid
        let query = {
            _id: userid
        }
        userDetails.findOne(query, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                return responses.sendError(res, languageCode, {}, "USER NOT_EXISTS", constants.responseMessageCode.NO_DATA_FOUND)
            } else {
                let setdata = {
                    defaultLanguage: req.body.defaultLanguage
                }
                userDetails.findOneAndUpdate(query, setdata, { new: true }, (error, resupdate) => {
                    if (error) {
                        return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                    } else {
                        return responses.actionCompleteResponse(res, languageCode, resupdate, "UPDATE SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                    }
                })
            }
        })

    }
}

//Verify Your Phone Number
const verifyphone = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['mobilenumber', 'userid'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        userDetails.findOne({ mobilenumber: req.body.mobilenumber }, (err, resexists) => {
            if (err) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (resexists) {
                return responses.sendError(res, languageCode, {}, "ALREADY_EXISTS", constants.responseMessageCode.EMAIL_ALREADY_EXISTS)
            } else {
                userDetails.findOne({ _id: req.body.userid }, (erruser, resuser) => {
                    if (err) {
                        return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                    } else if (resexists) {
                        return responses.sendError(res, languageCode, {}, "USER_NOT_EXISTS", constants.responseMessageCode.EMAIL_NOT_EXISTS)
                    } else {
                        let otp = commonFunctions.generateOTP()
                        let setdata = {
                            otp: otp,
                            mobilenumber: req.body.mobilenumber,
                            mobilenumberverified: true
                        }
                        userDetails.findOneAndUpdate({ _id: req.body.userid }, setdata, { new: true }, (error, resupdate) => {
                            if (error) {
                                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                            } else {
                                let otpdetails = {
                                    from: "Mobile Verification",
                                    to: req.body.mobilenumber,
                                    text: otp
                                }
                                commonFunctions.sendOtpNexmo(otpdetails)
                                let data = {
                                    _id: req.body.userid
                                }
                                return responses.actionCompleteResponse(res, languageCode, data, "OTP SENT  SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                            }
                        })
                    }
                })

            }
        })
    }
}
//RESEND OTP
const resendotp = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['mobilenumber'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        let otp = commonFunctions.generateOTP()
        userDetails.findOneAndUpdate({ mobilenumber: req.body.mobilenumber }, { $set: { otp: otp } }, { new: true }, (error, resupdate) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else {
                let otpdetails = {
                    from: "Mobile Verification",
                    to: req.body.mobilenumber,
                    text: otp
                }
                commonFunctions.sendOtpNexmo(otpdetails)
                let data = {
                    _id: resupdate._id
                }
                return responses.actionCompleteResponse(res, languageCode, data, "OTP SENT SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
            }
        })
    }

}
//VERIFY OTP
const verifyotp = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['otp', 'userid'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        userDetails.findOne({ _id: req.body.userid }, { password: 0 }, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                return responses.sendError(res, languageCode, {}, "USER NOT_EXISTS", constants.responseMessageCode.NO_DATA_FOUND)
            } else {
                console.log(resData)
                if (req.body.otp == resData.otp) {
                    userDetails.findOneAndUpdate({ _id: resData._id }, { $set: { mobilenumberverified: true } }, { new: true }, (err, suc) => {
                        if (err) {
                            return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                        } else {
                            const payload = {
                                userid: resData._id
                            };        
                            const accesstoken = commonFunctions.generateJWToken(payload)
                            let data = {
                                userdata: resData,
                                accesstoken: accesstoken
                            }
                            return responses.actionCompleteResponse(res, languageCode, data, "VERIFIED", constants.responseMessageCode.ACTION_COMPLETE)
                        }
                    })
                } else {
                    return responses.sendError(res, languageCode, {}, "WRONG OTP", constants.responseMessageCode.OTP_MISMATCH)
                }
            }
        })
    }
}

//LOG IN
const login = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    if (req.body.IsSocialMedia) {
        userDetails.findOne({ socialmedialoginid: req.body.id }, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                req.body.socialmedialogintype = req.body.logintype;
                req.body.socialmedialoginid = req.body.id;
                req.body.username = req.body.name;
                userDetails.create(req.body, (error, response) => {
                    if (error) {
                        if (error.code == "11000") {
                            return responses.sendError(res, languageCode, {}, "EMAIL_ALREADY_EXISTS", constants.responseMessageCode.EMAIL_ALREADY_EXISTS)
                        }
                        return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                    } else {
                        const payload = {
                            userid: response._id
                        };
                        const accesstoken = commonFunctions.generateJWToken(payload)
                        let data = {
                            userdata: response,
                            accesstoken: accesstoken
                        }
                        return responses.actionCompleteResponse(res, languageCode, data, "LOGGED IN SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                    }
                })
            } else {
                const payload = {
                    userid: resData._id
                };

                const accesstoken = commonFunctions.generateJWToken(payload)
                let data = {
                    userdata: resData,
                    accesstoken: accesstoken
                }
                return responses.actionCompleteResponse(res, languageCode, data, "LOGGED IN SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
            }
        })
    }

    else {
        userDetails.findOne({ email: req.body.email, "IsSocialMedia": false }, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                return responses.sendError(res, languageCode, {}, "EMAIL NOT_EXISTS", constants.responseMessageCode.ACCOUNT_NOT_REGISTER)
            } else {
                let currectPwd = Bcrypt.compareSync(req.body.password, resData.password)
                if (currectPwd) {
                    const payload = {
                        userid: resData._id
                    };
                    userDetails.findOneAndUpdate({ _id: resData._id }, { $set: { rememberme: true } }, { new: true }, (err, suc) => {
                        if (err) {
                            return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                        } else {
                            const accesstoken = commonFunctions.generateJWToken(payload)
                            let data = {
                                userdata: suc,
                                accesstoken: accesstoken
                            }
                            return responses.actionCompleteResponse(res, languageCode, data, "LOGGED IN SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                        }
                    })

                } else {
                    return responses.sendError(res, languageCode, {}, "INCORRECT PASSWORD", constants.responseMessageCode.ACCOUNT_NOT_REGISTER)
                }
            }
        })
    }
}


//Forget Password
const forgetpassword = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    let flag = Validator(req.body, ['email'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        userDetails.findOne({ email: req.body.email }, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                return responses.sendError(res, languageCode, {}, "EMAIL NOT_EXISTS", constants.responseMessageCode.EMAIL_NOT_EXISTS)
            } else {
                let newpassword = commonFunctions.generatepassword()
                console.log(newpassword)
                let password = Bcrypt.hashSync(newpassword, 10);
                userDetails.findOneAndUpdate({ email: req.body.email }, { $set: { password: password } }, { new: true }, (error, resupdate) => {
                    if (error) {
                        return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                    } else {
                        const mailOptions = {
                            from: "donotreply@gmail.com", // sender address
                            to: req.body.email,
                            subject: 'New Message',
                            html: "<p>Your new password " + newpassword + "</p>"
                        };
                        commonFunctions.sendEmailNodemailer(mailOptions)
                        return responses.actionCompleteResponse(res, languageCode, {}, "PASSWORD SENT SUCCESSFULLY TO YOUR MAIL", constants.responseMessageCode.ACTION_COMPLETE)
                    }
                })
            }

        })

    }
}
//Change Password
const changepassword = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    const userid = req.user._id || req.body.userid
    let flag = Validator(req.body, ['newpassword', 'oldpassword'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        let query = {
            _id: userid
        }
        userDetails.findOne(query, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                return responses.sendError(res, languageCode, {}, "USER NOT_EXISTS", constants.responseMessageCode.NO_DATA_FOUND)
            } else {
                let currectPwd = Bcrypt.compareSync(req.body.oldpassword, resData.password)
                if (currectPwd) {
                    const payload = {
                        userid: resData._id
                    };
                    let newpassword = Bcrypt.hashSync(req.body.newpassword, 10);
                    let setdata = {
                        password: newpassword
                    }
                    userDetails.findOneAndUpdate({ _id: resData._id }, setdata, { new: true }, (err, suc) => {
                        if (err) {
                            return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                        } else {
                            return responses.actionCompleteResponse(res, languageCode, {}, "PASSWORD CHANGED SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                        }
                    })

                } else {
                    return responses.sendError(res, languageCode, {}, "INCORRECT PASSWORD", constants.responseMessageCode.INCORRECT_PASSWORD)
                }
            }
        })

    }
}

//Create Account
const createaccount = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    const userid = req.user._id || req.body.userid
    let flag = Validator(req.body, ['username', 'height', 'weight', 'gender', 'healthissue', 'dob'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        let query = {
            _id: userid
        }
        userDetails.findOne(query, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                return responses.sendError(res, languageCode, {}, "USER NOT_EXISTS", constants.responseMessageCode.NO_DATA_FOUND)
            } else {
                let setdata = {
                    username: req.body.username,
                    dob: req.body.dob,
                    height: req.body.height,
                    weight: req.body.weight,
                    gender: req.body.gender,
                    healthissue: req.body.healthissue,
                    profilecomplete: true
                }

                userDetails.findOneAndUpdate(query, setdata, { new: true }, (error, resupdate) => {
                    if (error) {
                        console.log(error)
                        return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                    } else {
                        return responses.actionCompleteResponse(res, languageCode, resupdate, "UPDATE SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                    }
                })
            }
        })

    }
}

const getprofile = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    const userid = req.user._id || req.body.userid
    let query = {
        _id: userid
    }
    userDetails.findOne(query, { password: 0, otp: 0 }, (error, resData) => {
        if (error) {
            return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
        } else if (!resData) {
            return responses.sendError(res, languageCode, {}, "USER NOT_EXISTS", constants.responseMessageCode.NO_DATA_FOUND)
        } else {
            return responses.actionCompleteResponse(res, languageCode, resData, "USER PROFILE DETAILS", constants.responseMessageCode.ACTION_COMPLETE)
        }
    })
}
const addAddress = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    const userid = req.user._id || req.body.userid
    let flag = Validator(req.body, ['address'])
    if (flag)
        return responses.sendError(res, languageCode, {}, flag[1], flag[0])
    else if (!req.body)
        return responses.sendError(res, languageCode, {}, constants.responseMessageCode.CLIENT_ERROR, constants.responseMessageCode.CLIENT_ERROR)
    else {
        let query = {
            _id: userid
        }
        userDetails.findOne(query, (error, resData) => {
            if (error) {
                return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
            } else if (!resData) {
                return responses.sendError(res, languageCode, {}, "USER NOT_EXISTS", constants.responseMessageCode.NO_DATA_FOUND)
            } else {
                let setdata = {
                    address: req.body.address
                }
                userDetails.findOneAndUpdate(query, setdata, { new: true }, (error, resupdate) => {
                    if (error) {
                        return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
                    } else {
                        return responses.actionCompleteResponse(res, languageCode, resupdate, "UPDATE SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
                    }
                })
            }
        })

    }
}
const getlanguage = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    const userid = req.user._id || req.body.userid
    let query = {
        _id: userid
    }
    userDetails.findOne(query, { defaultLanguage: 1 }, (error, resData) => {
        if (error) {
            return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
        } else if (!resData) {
            return responses.sendError(res, languageCode, {}, "USER NOT_EXISTS", constants.responseMessageCode.NO_DATA_FOUND)
        } else {
            return responses.actionCompleteResponse(res, languageCode, resData, "DEFAULT LANGUAGE SUCCESSFULLY", constants.responseMessageCode.ACTION_COMPLETE)
        }
    })

}

const getprivacypolicy = (req, res) => {
    const languageCode = req.query.languageCode || 'en';
    termsandprivacy.findOne({}, (error, resData) => {
        if (error) {
            return responses.sendError(res, languageCode, {}, "INTERNAL SERVER ERROR", constants.responseMessageCode.ERROR_IN_EXECUTION)
        } else if (!resData) {
            return responses.sendError(res, languageCode, {}, "NOT_FOUND", constants.responseMessageCode.NO_DATA_FOUND)
        } else {
            return responses.actionCompleteResponse(res, languageCode, resData, "TERMS CONDITION PRIVACY POLICY", constants.responseMessageCode.ACTION_COMPLETE)
        }
    })
}

const removeuser = (req, res) => {
    userDetails.deleteOne({ _id: req.body._id }, (err, success) => {
        if (err) {
            return res.json({ message: "INTERNAL SERVER ERROR", err: err })
        } else if (!success) {
            return res.json({ message: "Not Exists" })
        }
        else {
            return res.json({ message: "Success", code: "200" })
        }
    })
}

module.exports = {
    signup,
    updatedefaultlanguage,
    verifyphone,
    resendotp,
    verifyotp,
    login,
    createaccount,
    getprofile,
    addAddress,
    getlanguage,
    getprivacypolicy,
    forgetpassword,
    changepassword,
    removeuser
}