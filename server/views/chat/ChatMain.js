const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
    Authorization: "trinh_nhung",
    "Content-Type": "application/json",
};
const socket = io("http://localhost:3000");


const getList = async () => {
    try {

        const response = await fetch(`${url}/user/getListUser`, {
            method: "GET",
            headers,
        });
        const data = await response.json();
        console.log(data);
        renderTable(data);

    } catch (err) {
        console.log(err);
    }
};
const renderTable = (data) => {
    const list_user = document.getElementById("list_user");
    list_user.innerHTML = "";

    data.forEach((item) => {
        const userItem = document.createElement("div");
        userItem.className =
            "flex items-center mb-4 cursor-pointer hover:bg-gray-200 p-2 rounded-lg";
        userItem.innerHTML = `
          <img
            src="${item.avata}"
            alt="Profile picture"
            class="w-10 h-10 rounded-full mr-2"
          />
          <span class="text-lg font-medium">${item.name}</span>
        `;

        // Thêm sự kiện click vào từng user
        userItem.addEventListener("click", () => {
            // Bỏ lớp nổi bật của tất cả người dùng
            const allUsers = document.querySelectorAll("#list_user > div");
            allUsers.forEach((user) =>
                user.classList.remove("bg-blue-500", "text-white")
            );

            // Thêm lớp nổi bật cho người dùng được chọn
            userItem.classList.add("bg-blue-500", "text-white");

            // Gọi hàm lấy lịch sử chat
            currentUserId = item._id;
            document.getElementById(
                "chatHeader"
            ).textContent = `To: ${item.name}`;
            fetchConversation(item._id);
        });

        list_user.appendChild(userItem);
    });
};


const fetchConversation = (userId) => {
    console.log(`Fetching conversation for user ID: ${userId}`);

    // Gửi yêu cầu lấy lịch sử chat
    socket.emit("getChatHistory", userId);

    // Lắng nghe sự kiện 'chatHistory' từ server
    socket.on("chatHistory", (data) => {
        const messagesContainer = document.getElementById("messages");
        messagesContainer.innerHTML = ""; // Xóa nội dung cũ

        // Hiển thị tin nhắn từ lịch sử
        data.messages.forEach((message) => {
            const messageElement = document.createElement("div");
            messageElement.className =
                message.sender === "Admin"
                    ? "text-right bg-green-400 text-white p-2 rounded-lg mb-2"
                    : "text-left bg-gray-200 p-2 rounded-lg mb-2";

            messageElement.textContent = `${message.sender}: ${message.content}`;
            messagesContainer.appendChild(messageElement);
        });
    });

    // Lắng nghe lỗi (nếu có)
    socket.on("chatHistoryError", (err) => {
        console.error(err);
    });
};

document.getElementById("sendMessageButton").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const content = messageInput.value.trim();

    if (content) {
        const userId = currentUserId; // ID của người dùng bạn đã click vào
        socket.emit("sendAdminMessage", { user_id: userId, content });

        messageInput.value = ""; // Xóa input sau khi gửi
    }
});

// Lắng nghe tin nhắn phản hồi
socket.on("receiveMessage", (message) => {
    const messagesContainer = document.getElementById("messages");

    const messageElement = document.createElement("div");
    messageElement.className =
        message.sender === "Admin"
            ? "text-right bg-green-400 text-white p-2 rounded-lg mb-2"
            : "text-left bg-gray-200 p-2 rounded-lg mb-2";

    messageElement.textContent = `${message.sender}: ${message.content}`;
    messagesContainer.appendChild(messageElement);
});


// Admin đăng ký vào phòng 'admin' để nhận tin nhắn
// socket.emit("register", "675c53ee1a5b2c003f94a04c");

// Lắng nghe tin nhắn từ người dùng
// socket.on("receiveMessage", (message) => {
//     console.log("Message from user: ", message); // Log tin nhắn nhận từ người dùng
//     const messagesContainer = document.getElementById("messages");
//     const messageElement = document.createElement("div");
//     messageElement.textContent = `${message.sender}: ${message.content}`;
//     messagesContainer.appendChild(messageElement);
// });

// // Gửi tin nhắn admin tới người dùng
// document
//     .getElementById("sendMessageButton")
//     .addEventListener("click", () => {
//         const messageInput = document.getElementById("messageInput");
//         const content = messageInput.value.trim();

//         if (content) {
//             const userId = "675c53ee1a5b2c003f94a04c";
//             socket.emit("sendAdminMessage", { user_id: userId, content });
//             messageInput.value = ""; // Clear input field
//         }
//     });
getList();
