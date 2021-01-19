const validator = require('validator');
const { responseMessageCode } = require('./constants')
module.exports = {
    validate_all_request: (request_body, require_parameter, inner_parameters, direct_body_parameters) => {
        function inner_paramater_function(data) {
            console.log(data);
            for (let key of inner_parameters) {
                if (!data[key])
                    return [responseMessageCode.CLIENT_ERROR, `"${key}" field is required`];
            }
        }


        if (direct_body_parameters) {
            for (let data of direct_body_parameters) {
                if (!request_body[data])
                    return [responseMessageCode.CLIENT_ERROR, `"${data}" FIELD IS REQUIRED`];
            }
        }
        for (let require_key of require_parameter) {
            switch (require_key) {
                case 'email':
                    if (!request_body['email']) {
                        return [responseMessageCode.CLIENT_ERROR, "EMAIL FIELD IS REQUIRED"];
                    }
                    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request_body['email']))) {
                        return [responseMessageCode.CLIENT_ERROR, "INVALID EMAIL"];
                    }
                    break;

                case 'password':
                    if (!request_body['password']) {
                        return [responseMessageCode.CLIENT_ERROR, "PASSWORD FIELD IS RREQUIRED"]
                    }
                    break;
                case 'newpassword':
                    if (!request_body['newpassword']) {
                        return [responseMessageCode.CLIENT_ERROR, "NEW PASSWORD FIELD IS RREQUIRED"]
                    }
                    break;
                case 'oldpassword':
                    if (!request_body['oldpassword']) {
                        return [responseMessageCode.CLIENT_ERROR, "OLD PASSWORD FIELD IS RREQUIRED"]
                    }
                    break;
                case 'mobilenumber':
                    if (!request_body['mobilenumber']) {
                        return [responseMessageCode.CLIENT_ERROR, "MOBILE FIELD IS RREQUIRED"]
                    }
                    break;
                case 'defaultLanguage':
                    if (!request_body['defaultLanguage']) {
                        return [responseMessageCode.CLIENT_ERROR, "CHOOSE A DEFAULT LANGUAGE"]
                    }
                    break;
                case 'otp':
                    if (!request_body['otp']) {
                        return [responseMessageCode.CLIENT_ERROR, "ENTER OTP"]
                    }
                    break;

                case 'userid':
                    if (!request_body['userid']) {
                        return [responseMessageCode.CLIENT_ERROR, "ID IS REQUIRED"]
                    }
                    break;
                case 'dob':
                    if (!request_body['dob']) {
                        return [responseMessageCode.CLIENT_ERROR, "DOB IS REQUIRED"]
                    }
                    break;
                case 'username':
                    if (!request_body['username']) {
                        return [responseMessageCode.CLIENT_ERROR, "USERNAME IS REQUIRED"]
                    }
                    break;
                case 'height':
                    if (!request_body['height']) {
                        return [responseMessageCode.CLIENT_ERROR, "HEIGHT IS REQUIRED"]
                    }
                    break;
                case 'weight':
                    if (!request_body['weight']) {
                        return [responseMessageCode.CLIENT_ERROR, "WEIGHT IS REQUIRED"]
                    }
                    break;
                case 'gender':
                    if (!request_body['gender']) {
                        return [responseMessageCode.CLIENT_ERROR, "GENDER IS REQUIRED"]
                    }
                    break;
                case 'healthissue':
                    if (!request_body['healthissue']) {
                        return [responseMessageCode.CLIENT_ERROR, "SELECT HEALTH ISSUE"]
                    }
                    break;
                case 'address':
                    if (!request_body['address']) {
                        return [responseMessageCode.CLIENT_ERROR, "ADDRESS IS REQ"]
                    }
                    break;
                case 'acceptterms':
                    if (!request_body['acceptterms']) {
                        return [responseMessageCode.CLIENT_ERROR, "ACCEPT TERMS AND PRIVACY POLICY"]
                    }
                    break;
                case 'categoryid':
                    if (!request_body['categoryid']) {
                        return [responseMessageCode.CLIENT_ERROR, "To Get Questions Please Provide Category Id"]
                    }
                    break;
                case 'answerlist':
                    if (!request_body['answerlist']) {
                        return [responseMessageCode.CLIENT_ERROR, "Answerlist"]
                    }
                    break;
            }
        }
    }
}
