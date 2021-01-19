let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

let chatbottopicmenuSchema = new Schema({
    name: {
        type: String,
    },
    desc: {
        type: String,
    }
}, {
        timestamps: true
    });
mongoose.model('chatbottopicmenu', chatbottopicmenuSchema).find({}, (err, list) => {
    if (list.length < 1) {
        let Object = [{
            _id:ObjectId("5f7b356c5189ca2c90483f5b"),
            name: "Periods",
            desc:"Text"
        }, {
            _id:ObjectId("5f7b356c5189ca2c90483f5c"),
            name: "Pregnancy",
            desc:"Text"
        }, {
            _id:ObjectId("5f7b356c5189ca2c90483f63"),
            name: "Birthcontrol",
            desc:"Text"
        }, {
            _id:ObjectId("5f7b356c5189ca2c90483f62"),
            name: "Emergency Contacepative",
            desc:"Text"
        },
        {
            _id:ObjectId("5f7b356c5189ca2c90483f5d"),
            name: "PCOS",
            desc:"Text"
        },
        {
            _id:ObjectId("5f7b356c5189ca2c90483f5e"),
            name: "Sexual Infections",
            desc:"Text"
        },
        {
            _id:ObjectId("5f7b356c5189ca2c90483f60"),
            name: "Urinary Infections",
            desc:"Text"
        }, {
            _id:ObjectId("5f7b356c5189ca2c90483f61"),
            name: "White Discharge",
            desc:"Text"
        }]
        mongoose.model('chatbottopicmenu', chatbottopicmenuSchema).insertMany(Object, (err, success) => {
            if (err) {

            } else {
                console.log("Static content saved successfully")
            }
        })
    } else {
        console.log("connected")
    }
})
module.exports = mongoose.model('chatbottopicmenu', chatbottopicmenuSchema);