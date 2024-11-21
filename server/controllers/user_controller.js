const { userModel } = require("../models/user_model")
const admin = require("../db/firebase_admin");

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

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });
        let obj = new userModel({
            name: req.body.name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password,
            user_name: req.body.user_name,
            location: req.body.location,
            avata: req.body.avata,
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({ status: "Add failed" })
    }
}

exports.updateuser = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.name = req.body.name;
        obj.email = req.body.email;
        obj.phone_number = req.body.phone_number;
        obj.password = req.body.password;
        obj.user_name = req.body.user_name;
        obj.location = req.body.location;
        obj.avata = req.body.avata;
        let result = await userModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
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
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
exports.registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        let newUser = new userModel({
            name,
            email,
            password
        });

        const result = await newUser.save();
        res.json({ status: "Registration successful", result });
    } catch (error) {
        res.json({ status: "Registration failed", error: error.message });
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

        // Nếu không tìm thấy người dùng
        if (!user) {
            return res.status(404).json({ status: "Login failed", message: "User not found" });
        }

        // Kiểm tra mật khẩu
        if (user.password !== password) {
            return res.status(401).json({ status: "Login failed", message: "Invalid password" });
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
// Thay đổi mật khẩu
exports.changePassword = async (req, res, next) => {
    const { email, newPassword } = req.body;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);

        await admin.auth().updateUser(userRecord.uid, {
            password: newPassword,
        });

        res.json({ status: "Password updated successfully" });
    } catch (error) {
        res.json({ status: "Failed to update password", error: error.message });
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
