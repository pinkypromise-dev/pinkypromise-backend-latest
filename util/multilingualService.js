const english = require('../localisation/english');

const LANGUAGES = {
    ENGLISH: 'en',
};

function getResponseMessage(code, languageCode) {
    switch (languageCode) {
        case LANGUAGES.ENGLISH:
            return english.responseMessages[code];
        default :
            return english.responseMessages[code];
    }
}
module.exports = {
    getResponseMessage
};
