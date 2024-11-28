const {user_roleModel} = require("../models/user_role_model")
const { userModel } = require("../models/user_model");
const { roleModel } = require("../models/role_model");
exports.getListuser_role = async (req, res, next) => {
    try {
        let listuser_role = await user_roleModel.find({});
        res.json(listuser_role);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }
};
exports.adduser_role = async (req, res, next) => {
    try {
        let obj = new user_roleModel({
            user_id: req.body.user_id,
            role_id: req.body.role_id
        })
        let result = await obj.save();
        res.json({ status: "Add successfully", result: result });
    } catch (error) {
        res.json({status: "Add failed" })
    }
}
exports.updateuser_role = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.user_id= req.body.user_id;
        obj.role_id= req.body.role_id;
        let result = await user_roleModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};
exports.deleteuser_role = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await user_roleModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};
exports.getuser_role = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await user_roleModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
exports.getuser_roleById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await user_roleModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
exports.getRolesByUserId = async (req, res, next) => {
    try {
        let userId = req.params.user_id;
        let result = await user_roleModel.find({ user_id: userId });
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
exports.getUsersByRoleId = async (req, res, next) => {
    try {
        let roleId = req.params.role_id;
        let result = await user_roleModel.find({ role_id: roleId });
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
exports.getAllUsersWithRoles = async (req, res, next) => {
    try {
        const usersWithRoles = await user_roleModel.find({})
        .populate('user_id', '_id name email')
        .populate('role_id', '_id name description'); 

        const userMap = new Map();

        usersWithRoles.forEach(item => {
            const userId = item.user_id._id.toString();
            if (!userMap.has(userId)) {
                userMap.set(userId, { user: item.user_id, roles: [] });
            }
            userMap.get(userId).roles.push(item.role_id);
        });
        const result = Array.from(userMap.values());

        res.json({ status: "Successfully", result: result });
        console.log(result)
    } catch (error) {
        console.error("Error fetching users with roles:", error);
        res.json({ status: "Failed to get users with roles", result: error });
    }
};
exports.removeRoleFromUser = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const roleId = req.body.role_id;

        const result = await user_roleModel.findOneAndDelete({ user_id: userId, role_id: roleId });

        if (result) {
            res.json({ status: "Role removed from user successfully", result: result });
        } else {
            res.json({ status: "Role not found for user" });
        }
    } catch (error) {
        res.json({ status: "Failed to remove role", result: error });
    }
};
exports.addRoleToUser = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const roleId = req.body.role_id;

        const existingRole = await user_roleModel.findOne({ user_id: userId, role_id: roleId });
        if (existingRole) {
            return res.json({ status: "Role already assigned to user" });
        }
        const newUserRole = new user_roleModel({
            user_id: userId,
            role_id: roleId,
        });
        const result = await newUserRole.save();
        res.json({ status: "Role added to user successfully", result: result });
    } catch (error) {
        res.json({ status: "Failed to add role to user", result: error });
    }
};
