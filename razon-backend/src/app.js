import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./index.js";
import { Server } from "socket.io";

dotenv.config({
  path: "./.env",
});

connectDB();
const server = app.listen(process.env.PORT, () => {
  console.log("Server Running at port: ", process.env.PORT);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    console.log(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("User joined room ", roomId);
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) {
      console.log("User not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user?._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // socket.off("setup", () => {
  //   console. log("USER DISCONNECTED");
  //   socket.leave(userData?._id);
  // });
});
