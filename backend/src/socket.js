import { Server } from "socket.io";
import { verifySocket } from "./middlewares/socket.middleware.js";

const socketHandler = (server) => {

    const io = new Server(server ,{
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use(verifySocket);

    const maxRoomCapacity = 10;
    const rooms = new Map(); // {roomID: [socketID1, socketID2] }
    const roomToHostMap = new Map(); // { roomID: hostID }
    const socketToRoomMap= new Map(); // { socketID: roomID }
    const userIdToSocketMap = new Map(); // { userID: socketID }
    const socketToUserIDMap = new Map(); // { socketID: userID }

  io.on("connection", (socket) => {
    const roomID = socket.user.roomID;
    console.log("User connected: ", socket.user.username);

    if(userIdToSocketMap.has(socket.user.username)) { // removing double socket id
        const prevSocketId = userIdToSocketMap.get(socket.user.username);
        rooms.set(roomID, rooms.get(roomID).filter((socketId) => socketId != prevSocketId));
    }

    socketToUserIDMap.set(socket.id, socket.user.username);
    userIdToSocketMap.set(socket.user.username, socket.id);

    const room = io.sockets.adapter.rooms.get(roomID);

    if(!room) {
        console.log("New room created: ", { host: socket.user.username, roomID });
        roomToHostMap.set(roomID, socket.user.username); // saving room host
        rooms.set(roomID, [socket.id]);
    } else if(room.size <= maxRoomCapacity) { // can be handle in middleware
        rooms.get(roomID).push(socket.id);
    } else {
        console.log(rooms.get(roomID));
        socket.emit("room:error", { message: "Room is full!"}); // self error message
        return;
    }
    let usersInThisRoom = rooms.get(roomID).map((socketID) => socketToUserIDMap.get(socketID));
    
    console.log(`Room (${roomID}) Joined! Users: `, usersInThisRoom);
    socket.join(roomID);
    socketToRoomMap.set(socket.id, roomID);
    socket.broadcast.to(roomID).emit("user:joined", socket.user.username);

    usersInThisRoom = usersInThisRoom.filter((userID) => userID != socket.user.username ); // removing current user
    // socket.broadcast.to(roomID).emit("users:joined", usersInThisRoom); remove it because it is running foreach socket instance already
    socket.emit("users:joined", usersInThisRoom); // to himself

    socket.on("sending signal", (payload) => {
        const toSocketId = userIdToSocketMap.get(payload.userToSignal);
        const from = socketToUserIDMap.get(socket.id);
        io.to(toSocketId).emit('incoming:call', { from, offer });
    });
    socket.on("user:call", ({to, offer}) => {
        const toSocketId = userIdToSocketMap.get(to);
        const from = socketToUserIDMap.get(socket.id);
        io.to(toSocketId).emit('user:joined', { callerID:from, signal: offer });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoomMap.get(socket.id);
        console.log("User disconnected: ", socket.user.username );
        
        if(roomID) {
            console.log("Room leave: ", { user: socket.user.username, roomID });
            socket.leave(roomID);
            io.to(roomID).emit("user:disconnect", socket.user.username);
        }
        if (rooms.has(roomID)) {
            let roomUsers = rooms.get(roomID);
            roomUsers = roomUsers.filter(id => id !== socket.id );
            rooms.set(roomID, roomUsers);
            if(roomUsers.length == 0) {
                roomToHostMap.delete(roomID);
                rooms.delete(roomID);
            }
            socketToRoomMap.delete(socket.id);
            userIdToSocketMap.delete(socket.user.username);
            socketToUserIDMap.delete(socket.id);
        }
        const usersInThisRoom = rooms.get(roomID)?.map((socketID) => socketToUserIDMap.get(socketID));
        socket.broadcast.to(roomID).emit("users:joined", usersInThisRoom || []);
    });
    // Error handling
    socket.on("error", (error) => {
      console.error(`Socket error for user ${username}:`, error);
    });
  });
}

export default socketHandler


    // socket.on("user:call", ({to, offer}) => {
    //     const toSocketId = userIdToSocketMap.get(to);
    //     const from = socketToUserIDMap.get(socket.id);
    //     io.to(toSocketId).emit('incoming:call', { from, offer });
    // });

    // socket.on("call:accepted", ({to, ans}) => {
    //     const toSocketId = userIdToSocketMap.get(to);
    //     const from = socketToUserIDMap.get(socket.id);
    //     io.to(toSocketId).emit('call:accepted', { from, ans });
    // });

    // socket.on("peer:nego:needed", ({to, offer}) => {
    //     // console.log("peer:nego:needed", offer);
    //     const toSocketId = userIdToSocketMap.get(to);
    //     const from = socketToUserIDMap.get(socket.id);
    //     io.to(toSocketId).emit("peer:nego:needed", {from, offer})
    // })

    // socket.on("peer:nego:done", ({to, ans}) => {
    //     // console.log("peer:nego:done", ans);
    //     const toSocketId = userIdToSocketMap.get(to);
    //     const from = socketToUserIDMap.get(socket.id);
    //     io.to(toSocketId).emit("peer:nego:final", {from, ans});
    // })