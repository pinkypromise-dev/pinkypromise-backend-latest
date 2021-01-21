const StoreMessage = require('../Model/Message');
const {formatMessage,MessageResponseFormat} = require('./messages');
const Authenticate = require ('./authentication/Authenticate');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  ConnectedList,
  Connected
} = require('./users');

function SocketService(socket) {
    socket.on('JoinToChatRoom', async(Info)=>{
        const user = userJoin(socket.id, Info);
        socket.join(user.ChatRoom);
    });

    // Listen for new chatMessage
    socket.on('NEW_CHAT_MESSAGE', async (data) => {
        // const user = getCurrentUser(socket.id);
        // // console.log(data)
        let Resp = await StoreMessage.Message(data);
        io.in(data.ChatRoomId).emit("RECIVE_NEW_CHAT_MESSAGE", Resp); //data.data
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        // console.log("Disconnecting")
        // console.log(socket.id);
        const user = userLeave(socket.id);
        if (user) {
        socket.leave(user.ChatRoom);
        }
    });
}
module.exports = {
    SocketService
};

