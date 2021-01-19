const moment = require('moment');

function formatMessage(username, text) {
  return {
    text,
    time: moment().format('h:mm a')
  };
}

function MessageResponseFormat(UserId, text) {
  return {
    id: UserId,
    text: text,
    time: moment().format('h:mm a')
  };
}
module.exports = {formatMessage,MessageResponseFormat};
