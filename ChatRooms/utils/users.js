const ChatRoomUsers = [];
const ConnectedSocketID = [];

// Join user to chat
function userJoin(id, Info) {
  const user = { socketId:id, userId:Info.userId, ChatRoom: Info.ChatRoom};
  ChatRoomUsers.push(user);
  return user;
}

function Connected(id) {
  const Data = {Count:ConnectedSocketID.length,SocketId:id};
  ConnectedSocketID.push(Data);
  return Data;
}
function ConnectedList() {
  return ({status:200,message:"success",ConnectionLog: ConnectedSocketID});
}


// Get current user
function getCurrentUser(id) {
  return ChatRoomUsers.find(user => user.socketId === id);
}

// User leaves chat
function userLeave(id) {
  const index = ChatRoomUsers.findIndex(user => user.socketId === id);

  if (index !== -1) {
    return ChatRoomUsers.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return ChatRoomUsers.filter(user => user.ChatRoom === room);
}
// Get room users
function getListLiveUsers(room) {
  return ChatRoomUsers.filter(user => user.ChatRoom === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  ConnectedList,
  Connected,
  getListLiveUsers
};
