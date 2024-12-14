const { userModel } = require("../models/user_model")
const admin = require("../db/firebase_admin");
const { uploadToCloudinary } = require("../routes/uploads");
const fs = require("fs");
const cloudinary = require('cloudinary').v2;
exports.getListuser = async (req, res, next) => {
    try {
        let listuser = await userModel.find({});
        res.json(listuser);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};


exports.adduser = async (req, res, next) => {
    const { email, password } = req.body;

    // Kiểm tra xem có tệp được tải lên hay không
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        // Tạo người dùng trên Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        // Upload ảnh lên Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
            folder: 'Petify_Images', // Thư mục lưu ảnh trên Cloudinary
            allowed_formats: ['jpg', 'jpeg', 'png']
        });

        // Lấy URL của ảnh sau khi tải lên
        const avatarUrl = uploadedImage.secure_url;

        // Tạo đối tượng người dùng trong MongoDB
        const obj = new userModel({
            name: req.body.name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password,
            user_name: req.body.user_name,
            location: req.body.location,
            avata: avatarUrl, // URL từ Cloudinary
        });

        // Lưu người dùng vào cơ sở dữ liệu
        const result = await obj.save();

        // Phản hồi lại client
        res.json({ status: "Add successfully", result });
    } catch (error) {
        console.error('Error in adduser:', error);
        res.status(500).json({ status: "Add failed", error: error.message });
    }
};

exports.updateuser = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Kiểm tra xem có tệp mới được tải lên hay không
        let avatarUrl = null;
        if (req.file) {
            // Upload tệp mới lên Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Petify_Images', // Thư mục lưu ảnh trên Cloudinary
                allowed_formats: ['jpg', 'jpeg', 'png']
            });
            avatarUrl = uploadedImage.secure_url; // Lấy URL từ Cloudinary
        }

        // Tạo đối tượng cập nhật
        const obj = {
            name: req.body.name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password,
            user_name: req.body.user_name,
            location: req.body.location,
        };

        // Nếu có avatar mới, thêm URL vào đối tượng
        if (avatarUrl) {
            obj.avata = avatarUrl;
        }

        console.log(obj, "Đối tượng cập nhật");

        // Thực hiện cập nhật người dùng
        const result = await userModel.findByIdAndUpdate(id, obj, { new: true });

        // Trả về phản hồi
        res.status(200).json({ status: "Update successfully", result });
    } catch (error) {
        console.error('Error in updateuser:', error);
        res.status(500).json({ status: "Update failed", error: error.message });
    }
};
exports.deleteuser = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getuser = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getuserById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        res.json(result);
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.registerUser = async (req, res, next) => {
    const { name, email, password, phone_number } = req.body;

    try {
        // Kiểm tra email trên server
        const emailExists = await userModel.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                status: "Thất bại",
                error: "Email này đã được đăng ký. Vui lòng sử dụng email khác.",
            });
        }

        // Kiểm tra số điện thoại trên server
        const phoneExists = await userModel.findOne({ phone_number });
        if (phoneExists) {
            return res.status(400).json({
                status: "Thất bại",
                error: "Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác.",
            });
        }

        // Kiểm tra email trên Firebase
        try {
            await admin.auth().getUserByEmail(email);
            return res.status(400).json({
                status: "Thất bại",
                error: "Email này đã tồn tại trên hệ thống Firebase.",
            });
        } catch (firebaseError) {
            // Không tìm thấy trên Firebase là hợp lệ, tiếp tục
        }

        // Kiểm tra số điện thoại trên Firebase
        try {
            await admin.auth().getUserByPhoneNumber(phone_number);
            return res.status(400).json({
                status: "Thất bại",
                message: "Số điện thoại này đã tồn tại trên hệ thống Firebase.",
            });
        } catch (firebaseError) {
            // Không tìm thấy trên Firebase là hợp lệ, tiếp tục
        }

        // Tạo người dùng trên Firebase
        const userRecord = await admin.auth().createUser({
            email,
            password,
            phoneNumber: phone_number,
        });

        // Lưu thông tin người dùng vào MongoDB
        const newUser = new userModel({
            name,
            email,
            password,
            phone_number,
        });

        const result = await newUser.save();

        res.json({
            status: "Thành công",
            message: "Đăng ký người dùng thành công.",
            result: {
                id: result._id,
                name: result.name,
                email: result.email,
                phone_number: result.phone_number,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "Thất bại",
            error: error.message,
        });
    }
};


exports.loginUser = async (req, res, next) => {
    const { login, password } = req.body; // `login` có thể là email hoặc số điện thoại

    try {
        let user;

        // Kiểm tra nếu `login` là email hay số điện thoại
        if (login.includes("@")) {
            // Tìm người dùng bằng email
            user = await userModel.findOne({ email: login });
        } else {
            // Tìm người dùng bằng số điện thoại
            user = await userModel.findOne({ phone_number: login });
        }
        if (!login || !password) {
            return res.status(400).json({ status: "Login failed", error: "Missing login or password" });
        }

        // Nếu không tìm thấy người dùng
        if (!user) {
            return res.status(404).json({ status: "Login failed", error: "User not found" });
        }

        // Kiểm tra mật khẩu
        if (user.password !== password) {
            return res.status(401).json({ status: "Login failed", error: "Invalid password" });
        }

        // Tạo token xác thực
        const token = await admin.auth().createCustomToken(user._id.toString());

        res.json({ status: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ status: "Login failed", error: error.message });
    }
};


exports.resetPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Gửi email đặt lại mật khẩu thông qua Firebase Authentication
        const resetLink = await admin.auth().generatePasswordResetLink(email);

        res.json({ status: "Reset password email sent successfully", resetLink });
    } catch (error) {
        res.json({ status: "Failed to send reset password email", error: error.message });
    }
};
exports.changePassword = async (req, res, next) => {
    const { phone_number, newPassword } = req.body;

    // Kiểm tra đầu vào
    if (!phone_number || typeof phone_number !== 'string') {
        return res.status(400).json({
            status: "Failed",
            message: "Invalid phone number",
        });
    }

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
            status: "Failed",
            message: "Password must be at least 6 characters long",
        });
    }

    try {
        // Lấy thông tin người dùng từ số điện thoại
        const userRecord = await admin.auth().getUserByPhoneNumber(phone_number);

        // Cập nhật mật khẩu mới cho người dùng
        await admin.auth().updateUser(userRecord.uid, {
            password: newPassword,
        });

        return res.json({
            status: "Success",
            message: "Password updated successfully"
        });
    } catch (error) {
        // Cải thiện xử lý lỗi
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
            });
        }

        // Xử lý các lỗi khác
        console.error("Error updating password:", error);
        return res.status(500).json({
            status: "Failed",
            message: "An unexpected error occurred. Please try again later.",
        });
    }
};

// Xác thực tài khoản người dùng qua email
exports.verifyEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const verifyLink = await admin.auth().generateEmailVerificationLink(email);

        res.json({ status: "Verification email sent successfully", verifyLink });
    } catch (error) {
        res.json({ status: "Failed to send verification email", error: error.message });
    }
};
// Lấy danh sách người dùng Firebase Authen
exports.listFirebaseUsers = async (req, res, next) => {
    try {
        let users = [];
        const listUsersResult = await admin.auth().listUsers();
        listUsersResult.users.forEach(userRecord => {
            users.push(userRecord.toJSON());
        });

        res.json({ status: "Successfully retrieved users", users });
    } catch (error) {
        res.json({ status: "Failed to retrieve users", error: error.message });
    }
};
// Vô hiệu hóa tài khoản 
exports.disableUser = async (req, res, next) => {
    const { email } = req.body;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);

        await admin.auth().updateUser(userRecord.uid, {
            disabled: true,
        });

        res.json({ status: "User disabled successfully" });
    } catch (error) {
        res.json({ status: "Failed to disable user", error: error.message });
    }
};
// Kích hoạt lại tài khoản
exports.enableUser = async (req, res, next) => {
    const { email } = req.body;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(userRecord.uid, {
            disabled: false,
        });

        res.json({ status: "User enabled successfully" });
    } catch (error) {
        res.json({ status: "Failed to enable user", error: error.message });
    }
};

exports.updateUserAddress = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID của user từ URL
        const { location } = req.body; // Lấy địa chỉ từ request body

        if (!location) {
            return res.status(400).json({ status: "Update failed", error: "Location is required" });
        }

        // Tìm và cập nhật location của user
        const result = await userModel.findByIdAndUpdate(
            id,
            { location },
            { new: true } // Trả về bản ghi sau khi cập nhật
        );

        if (!result) {
            return res.status(404).json({ status: "Update failed", error: "User not found" });
        }

        res.json({ status: "Address updated successfully", result });
    } catch (error) {
        res.status(500).json({ status: "Update failed", error: error.message });
    }
};


exports.getNewUsers = async (req, res, next) => {
    const { startDate, endDate } = req.query;

    // Kiểm tra và chuyển đổi startDate và endDate sang kiểu Date
    const startOfDay = startDate ? new Date(startDate) : new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = endDate ? new Date(endDate) : new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        // Truy vấn danh sách người dùng được tạo trong khoảng thời gian
        const newUsers = await userModel.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        res.status(200).json({ success: true, result: newUsers });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách user mới:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
};
