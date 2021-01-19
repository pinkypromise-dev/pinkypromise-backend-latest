let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

let moredescSchema = new Schema({
    categoryid: { type: Schema.Types.ObjectId, ref: 'chatbottopicmenu' },
    description: {
        type: String,
    },
    imageslist: [],
    pdflink: String
}, {
        timestamps: true
    });
mongoose.model('CategoryMoreDescription', moredescSchema).find({}, (err, list) => {
    if (list.length < 1) {
        let Object = [{
            categoryid: ObjectId("5f7b356c5189ca2c90483f5b"),
            description: "Periods",
            imageslist: ["Text"],
            pdflink: ""
        }, {
            categoryid: ObjectId("5f7b356c5189ca2c90483f5c"),
            description: "Pregnancy",
            imageslist: ["Text"],
            pdflink: ""
        }, {
            categoryid: ObjectId("5f7b356c5189ca2c90483f63"),
            description: "Birthcontrol",
            imageslist: ["Text"],
            pdflink: ""
        }, {
            categoryid: ObjectId("5f7b356c5189ca2c90483f62"),
            description: "Emergency Contacepative",
            imageslist: ["Text"],
            pdflink: ""
        },
        {
            categoryid: ObjectId("5f7b356c5189ca2c90483f5d"),
            description: "PCOS",
            imageslist: ["Text"],
            pdflink: ""
        },
        {
            categoryid: ObjectId("5f7b356c5189ca2c90483f5e"),
            description: "Sexual Infections",
            imageslist: ["Text"],
            pdflink: ""
        },
        {
            categoryid: ObjectId("5f7b356c5189ca2c90483f60"),
            description: "Urinary Infections",
            imageslist: ["Text"],
            pdflink: ""
        }, {
            categoryid: ObjectId("5f7b356c5189ca2c90483f61"),
            description: "White Discharge",
            imageslist: ["Text"],
            pdflink: ""
        }]
        mongoose.model('CategoryMoreDescription', moredescSchema).insertMany(Object, (err, success) => {
            if (err) {

            } else {
                console.log("Static content saved successfully")
            }
        })
    } else {
        console.log("connected")
    }
})
module.exports = mongoose.model('CategoryMoreDescription', moredescSchema);