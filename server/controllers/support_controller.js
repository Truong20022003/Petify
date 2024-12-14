const { supportModel } = require('./models/support_model'); // Import model support
const { userModel } = require('./models/user_model'); // Import model user
const http = require("http");
const socketIo = require("socket.io");

const app = require('./app'); // Import Express app
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Cho phép mọi domain kết nối
    methods: ["GET", "POST"],
  },
});

// Khi một client kết nối
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Lắng nghe tin nhắn từ admin hoặc user
  socket.on("sendMessage", async ({ userId, sender, content }) => {
    try {
      const message = {
        sender,
        content,
        createdAt: new Date(),
      };

      // Lưu tin nhắn vào MongoDB
      await supportModel.updateOne(
        { user_id: userId },
        { $push: { messages: message } },
        { upsert: true } // Tạo document nếu chưa tồn tại
      );

      // Phát tin nhắn đến tất cả client
      io.emit("receiveMessage", { userId, sender, content, createdAt: message.createdAt });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  // Khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
