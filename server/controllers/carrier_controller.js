const { carrierModel } = require("../models/carrier_model");
const { orderModel } = require("../models/order_model"); // Import model của order
exports.getListCarrier = async (req, res, next) => {
  try {
    let listCarrier = await carrierModel.find({});
    res.json(listCarrier);
  } catch (error) {
    res.json({ status: "Not found", result: error });
  }
};

exports.addCarrier = async (req, res, next) => {
  try {
    let obj = new carrierModel({
      name: req.body.name,
      phone: req.body.phone,
    });

    let result = await obj.save();
    res.json({ status: "Add successfully", result: result });
  } catch (error) {
    res.json({ status: "Add failed" });
  }
};

exports.updateCarrier = async (req, res, next) => {
  try {
    let id = req.params.id;
    let obj = {};
    obj.name = req.body.name;
    obj.phone = req.body.phone;
    let result = await carrierModel.findByIdAndUpdate(id, obj, { new: true });
    res.json({ status: "Update successfully", result: result });
  } catch (error) {
    res.json({ status: "Update falied", result: error });
  }
};

exports.deletecarrier = async (req, res, next) => {
  try {
    let id = req.params.id;

    // Kiểm tra xem đơn vị vận chuyển có được sử dụng trong đơn hàng nào không
    const ordersUsingCarrier = await orderModel.find({ carrier_id: id });
    console.log(ordersUsingCarrier, "ordersUsingCarrier");
    if (ordersUsingCarrier.length > 0) {
      return res.status(400).json({
        status: "Delete failed",
        message:
          "Không thể xóa đơn vị vận chuyển này vì còn đơn hàng liên quan.",
      });
    }

    // Nếu không có đơn hàng sử dụng, tiến hành xóa đơn vị vận chuyển
    let result = await carrierModel.findByIdAndDelete(id);
    res.json({ status: "Delete successfully", result: result });
  } catch (error) {
    res.json({ status: "Delete failed", result: error });
  }
};

exports.getcarrier = async (req, res, next) => {
  try {
    let id = req.params.id;
    let result = await carrierModel.findById(id);
    res.json({ status: "Successfully", result: result });
  } catch (error) {
    res.json({ status: "Not found", result: error });
  }
};

exports.getCarrierById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let result = await carrierModel.findById(id);
    res.json({ status: "Successfully", result: result });
  } catch (error) {
    res.json({ status: "Not found", result: error });
  }
};
