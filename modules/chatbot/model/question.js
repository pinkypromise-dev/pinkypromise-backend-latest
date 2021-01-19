let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const fs = require('fs');

let questionsSchema = new Schema({
    categoryid: Schema.Types.ObjectId,
    quetionlist: [
        {
            question: String,
            answerlist: [{
                answer:String,
                weightage:Number
            }],
            level: Number
        }
    ],
    possibleresultList:[]
}, {
        timestamps: true
    });

    module.exports = mongoose.model('questionsanswer', questionsSchema).findOne({}, (err, res) => {
        if (!res) {
            const permission = fs.readFileSync(__dirname + '/basicquestions.json', 'utf-8');
            JSON.parse(permission).map(singleObj => {
                const data1 = mongoose.model('questionsanswer', questionsSchema).create(singleObj, (error, success) => {
                    if (error)
                        console.log("Error is" + error)
                    
                       
                })
            });
            console.log("Static content  saved succesfully.");
        }
    });
module.exports = mongoose.model('questionsanswer', questionsSchema);