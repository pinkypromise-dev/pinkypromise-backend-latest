let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let termmsandprivacySchema = new Schema({
    terms: {
        type: String,
        default: "xyz"
    },
    privacypolicy: {
        type: String,
        default: "xyz"
    },
}, {
        timestamps: true
    });
mongoose.model('TermsAndPolicy', termmsandprivacySchema).findOne({}, (err, res) => {
    if (!res) {
        let obj={
            terms:"xyz",
            privacypolicy:"xyz"
        }
        mongoose.model('TermsAndPolicy', termmsandprivacySchema).create(obj, (error, success) => {
            if (error)
                console.log("Error is" + error)
            else
                console.log("Static content  saved succesfully.");
        })

    }
});
module.exports = mongoose.model('TermsAndPolicy', termmsandprivacySchema);