const { invoiceModel } = require("../models/invoice_model")
const { invoice_detailModel } = require("../models/invoice_detail_model")
const { productModel } = require("../models/product_model")
const { orderModel } = require("../models/order_model")
const { user_roleModel } = require("../models/user_role_model")

exports.getListinvoice = async (req, res, next) => {
    try {
        let listinvoice = await invoiceModel.find({});
        res.json(listinvoice);
    } catch (error) {
        res.json({ status: "not found", result: error });
    }

};

exports.addinvoice = async (req, res, next) => {
    try {
        let obj = new invoiceModel({
            user_id: req.body.user_id,
            total: req.body.total,
            date: req.body.date,
            status: req.body.status,
            payment_method: req.body.payment_method,
            delivery_address: req.body.delivery_address,
            shipping_fee: req.body.shipping_fee,
            carrier_id: req.body.carrier_id,
            order_id: req.body.order_id
        })
        let result = await obj.save();
        res.status(200).json({ status: "Add successfully", result: result });
    } catch (error) {
        res.status(500).json({ status: "Add failed" })
    }
}

exports.updateinvoice = async (req, res, next) => {
    try {
        let id = req.params.id;
        let obj = {};
        obj.user_id = req.body.user_id
        obj.total = req.body.total
        obj.date = req.body.date
        obj.status = req.body.status
        obj.payment_method = req.body.payment_method
        obj.delivery_address = req.body.delivery_address
        obj.shipping_fee = req.body.shipping_fee
        obj.carrier_id = req.body.carrier_id
        obj.order_id = req.body.order_id
        let result = await invoiceModel.findByIdAndUpdate(id, obj, { new: true });
        res.json({ status: "Update successfully", result: result });
    } catch (error) {
        res.json({ status: "Update falied", result: error });
    }
};

exports.deleteinvoice = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoiceModel.findByIdAndDelete(id);
        res.json({ status: "Delete successfully", result: result });
    } catch (error) {
        res.json({ status: "Delete falied", result: error });
    }
};

exports.getinvoice = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoiceModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};

exports.getinvoiceById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await invoiceModel.findById(id);
        res.json({ status: "Successfully", result: result });
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
};
exports.getInvoiceByIdUser = async (req, res, next) => {
    try {
        const userId = req.params.user_id; // Lấy user_id từ tham số URL

        // Tìm các hóa đơn có `user_id` tương ứng
        const invoices = await invoiceModel.find({ user_id: userId });

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ message: "No invoices found for this user." });
        }

        // Nếu tìm thấy hóa đơn
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error fetching invoices", result: error });
    }
};

//////Doanh thu theo từng tháng trong năm
exports.RevenueByMonth = async (req, res, next) => {
    const year = req.params.year; // Lấy năm từ tham số URL

    try {
        // Kiểm tra xem năm có hợp lệ hay không
        if (isNaN(year) || year.length !== 4) {
            return res.status(400).json({ message: "Invalid year format" });
        }

        // Truy vấn doanh thu và số lượng đơn hàng từ bảng `invoice`, phân chia theo tháng
        const result = await invoiceModel.aggregate([
            {
                $match: {
                    // Lọc các hóa đơn trong năm người dùng nhập vào, sử dụng createdAt
                    createdAt: {
                        $gte: new Date(`${year}-01-01T00:00:00Z`),  // Đầu năm
                        $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`)  // Cuối năm
                    }
                }
            },
            {
                $project: {
                    // Lấy tháng và năm từ trường createdAt (kiểu Date)
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    totalRevenue: { $add: [{ $toDouble: "$total" }, { $toDouble: "$shipping_fee" }] }, // Tính tổng doanh thu (bao gồm phí ship)
                }
            },
            {
                $group: {
                    // Nhóm theo tháng
                    _id: "$month",
                    totalRevenue: { $sum: "$totalRevenue" },
                    totalOrders: { $sum: 1 } // Đếm số lượng đơn hàng
                }
            },
            {
                $sort: { _id: 1 } // Sắp xếp theo thứ tự tháng (tăng dần)
            }
        ]);

        // Tạo dữ liệu trả về theo dạng mảng có đủ 12 tháng
        let monthlyData = new Array(12).fill({ totalRevenue: 0, totalOrders: 0 }); // Mảng khởi tạo giá trị mặc định

        result.forEach(item => {
            // Cập nhật doanh thu và số lượng đơn hàng vào mảng
            const month = item._id - 1; // Lấy tháng (0-11)
            monthlyData[month] = {
                totalRevenue: item.totalRevenue,
                totalOrders: item.totalOrders
            };
        });

        // Trả về kết quả
        res.status(200).json(monthlyData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating monthly revenue and order count" });
    }
};




////Thống d tổng đơn hàng, doanh thu, và sản phẩm  và số lượng bán của nó trong ngày tháng năm cụ thể
exports.statisticsByDateRange = async (req, res, next) => {
    try {
        // Lấy tham số ngày bắt đầu và ngày kết thúc từ query string
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "Please provide startDate and endDate."
            });
        }

        // Chuyển đổi ngày bắt đầu và ngày kết thúc thành đối tượng Date
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày để bao gồm toàn bộ ngày kết thúc

        // Lấy danh sách sản phẩm được bán ra trong khoảng thời gian
        const productStats = await invoice_detailModel.aggregate([
            {
                $lookup: {
                    from: "invoice", // Liên kết với bảng `invoice`
                    localField: "invoice_id", // Khóa liên kết từ bảng `invoice_detail`
                    foreignField: "_id", // Khóa liên kết từ bảng `invoice`
                    as: "invoice_info" // Tên trường chứa thông tin từ bảng `invoice`
                }
            },
            {
                $unwind: "$invoice_info" // Giải nén mảng `invoice_info` thành đối tượng
            },
            {
                $addFields: {
                    invoice_date: { $toDate: "$invoice_info.date" } // Chuyển đổi chuỗi ngày thành đối tượng Date
                }
            },
            {
                $match: {
                    // Chỉ lấy các hóa đơn trong khoảng thời gian yêu cầu
                    "invoice_date": {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: "$product_id", // Nhóm theo ID sản phẩm
                    totalQuantity: { $sum: "$quantity" }, // Tính tổng số lượng bán ra của sản phẩm
                    purchaseCount: { $sum: 1 } // Đếm số lượt mua sản phẩm
                }
            },
            {
                $lookup: {
                    from: "product", // Liên kết với bảng `product`
                    localField: "_id", // ID sản phẩm từ kết quả `group`
                    foreignField: "_id", // ID sản phẩm trong bảng `product`
                    as: "product_info" // Tên trường chứa thông tin sản phẩm
                }
            },
            {
                $unwind: "$product_info" // Giải nén thông tin sản phẩm
            },
            {
                $addFields: {
                    product_info: {
                        $mergeObjects: [
                            "$product_info", // Toàn bộ thông tin từ bảng `product`
                            {
                                totalQuantity: "$totalQuantity", // Thêm tổng số lượng bán ra
                                purchaseCount: "$purchaseCount" // Thêm số lượt mua
                            }
                        ]
                    }
                }
            },
            {
                $replaceRoot: { newRoot: "$product_info" } // Thay thế root bằng toàn bộ thông tin sản phẩm
            },
            {
                $sort: { totalQuantity: -1 } // Sắp xếp sản phẩm theo số lượng bán ra (giảm dần)
            },
            {
                $limit: 5 // Lấy top 5 sản phẩm bán chạy
            }
        ]);

        // Tính tổng số đơn hàng và tổng doanh thu
        const summary = await invoiceModel.aggregate([
            {
                $addFields: {
                    invoice_date: { $toDate: "$date" } // Chuyển đổi chuỗi ngày thành đối tượng Date
                }
            },
            {
                $match: {
                    // Chỉ lấy hóa đơn trong khoảng thời gian yêu cầu
                    invoice_date: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: null, // Không nhóm theo trường nào
                    totalOrders: { $sum: 1 }, // Đếm tổng số đơn hàng
                    totalRevenue: { $sum: "$total" } // Tính tổng doanh thu
                }
            }
        ]);

        // Trả về kết quả
        return res.status(200).json({
            totalOrders: summary[0]?.totalOrders || 0,
            totalRevenue: summary[0]?.totalRevenue || 0,
            topProducts: productStats // Danh sách sản phẩm bán chạy trong khoảng thời gian
        });
    } catch (error) {
        console.error("Error in statisticsByDateRange:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
};

exports.getMonthlyRevenue = async (req, res, next) => {
    try {
        const currentYear = new Date().getFullYear();

        // Lấy tổng doanh thu theo tháng trong năm từ trường createdAt
        const revenueByMonth = await invoiceModel.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    total: 1,
                    shipping_fee: { $toDouble: "$shipping_fee" } // Đảm bảo shipping_fee là số
                }
            },
            {
                $match: {
                    year: currentYear // Lọc theo năm hiện tại
                }
            },
            {
                $group: {
                    _id: "$month",
                    totalRevenue: { $sum: { $add: ["$total", "$shipping_fee"] } } // Cộng tổng thu + phí vận chuyển
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const result = Array.from({ length: 12 }, (_, index) => {
            const monthRevenue = revenueByMonth.find(item => item._id === index + 1);
            return {
                month: index + 1,
                totalRevenue: monthRevenue ? monthRevenue.totalRevenue : 0
            };
        });

        // Kiểm tra doanh thu tháng 12
        console.log('Revenue for December:', result[11].totalRevenue);

        // Tính phần trăm thay đổi
        const comparison = result.map((monthData, index) => {
            let percentageChange = 0;

            if (index === 0) {
                const lastMonthRevenue = result[index - 1]?.totalRevenue || 0;
                const currentMonthRevenue = monthData.totalRevenue;

                if (lastMonthRevenue > 0) {
                    percentageChange = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
                }
            } else {
                const lastMonthRevenue = result[index - 1].totalRevenue;
                const currentMonthRevenue = monthData.totalRevenue;

                if (lastMonthRevenue > 0) {
                    percentageChange = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
                }
            }

            return {
                month: monthData.month,
                totalRevenue: monthData.totalRevenue,
                percentageChange: percentageChange.toFixed(2)
            };
        });

        res.status(200).json({
            message: "Thống kê doanh thu theo tháng thành công.",
            revenueByMonth: result,
            comparison: comparison
        });

    } catch (error) {
        console.error("Lỗi thống kê doanh thu:", error);
        res.status(500).json({ message: "Có lỗi xảy ra khi thống kê doanh thu.", error: error.message });
    }
};

///thống kê trạng thái đơn hàng
exports.statisticsByDateRangeStatus = async (req, res, next) => {
    try {
        // Lấy tham số ngày bắt đầu và ngày kết thúc từ query string
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "Please provide startDate and endDate."
            });
        }

        // Chuyển đổi ngày bắt đầu và ngày kết thúc thành đối tượng Date
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày để bao gồm toàn bộ ngày kết thúc

        // Thống kê số lượng đơn hàng trạng thái "thành công" từ bảng `invoice`
        const successfulOrders = await invoiceModel.aggregate([
            {
                $addFields: {
                    invoice_date: { $toDate: "$createdAt" } // Chuyển đổi chuỗi ngày thành đối tượng Date
                }
            },
            {
                $match: {
                    invoice_date: { $gte: start, $lte: end }, // Lọc theo khoảng thời gian
                    status: "Thành công" // Chỉ lấy trạng thái "thành công"
                }
            },
            {
                $group: {
                    _id: "$status", // Nhóm theo trạng thái đơn hàng
                    count: { $sum: 1 } // Đếm số lượng đơn hàng theo trạng thái
                }
            },
            {
                $project: {
                    status: "$_id", // Tên trạng thái
                    count: 1, // Số lượng đơn hàng
                    _id: 0 // Loại bỏ _id
                }
            }
        ]);

        // Thống kê số lượng đơn hàng theo tất cả trạng thái từ bảng `order`
        const orderStatusStats = await orderModel.aggregate([
            {
                $addFields: {
                    order_date: { $toDate: "$createdAt" } // Chuyển đổi chuỗi ngày thành đối tượng Date
                }
            },
            {
                $match: {
                    order_date: { $gte: start, $lte: end } // Lọc theo khoảng thời gian
                }
            },
            {
                $group: {
                    _id: "$status", // Nhóm theo trạng thái đơn hàng
                    count: { $sum: 1 } // Đếm số lượng đơn hàng theo trạng thái
                }
            },
            {
                $project: {
                    status: "$_id", // Tên trạng thái
                    count: 1, // Số lượng đơn hàng
                    _id: 0 // Loại bỏ _id
                }
            }
        ]);

        // Kết hợp dữ liệu từ cả hai bảng
        const combinedStats = [...orderStatusStats];

        successfulOrders.forEach(stat => {
            const existingStat = combinedStats.find(s => s.status === stat.status);
            if (existingStat) {
                existingStat.count += stat.count;
            } else {
                combinedStats.push(stat);
            }
        });

        // Trả về kết quả
        return res.status(200).json({
            statusStatistics: combinedStats
        });
    } catch (error) {
        console.error("Error in statisticsByDateRange:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
};
////Thống kê những đơn hàng có trạng thái chờ xác nhận
exports.getAllUserOrders = async (req, res, next) => {
    try {
        // Lấy tham số thời gian bắt đầu và kết thúc từ query string
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "Please provide startDate and endDate.",
                data: []
            });
        }

        // Chuyển đổi tham số thời gian thành đối tượng Date
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Bao gồm toàn bộ ngày kết thúc

        // Lấy tất cả đơn hàng trong khoảng thời gian, kèm thông tin người dùng
        const pendingOrders = await orderModel.find({
            status: "Đang chờ xác nhận",
            createdAt: { $gte: start, $lte: end } // Lọc theo khoảng thời gian
        })
            .populate({
                path: "user_id", // Liên kết với trường user_id trong order
                select: "-password", // Loại bỏ trường mật khẩu (nếu có) từ bảng user
            })
            .lean(); // Trả về dữ liệu dạng JSON thuần để dễ xử lý

        // Kiểm tra nếu không có đơn hàng nào
        if (!pendingOrders || pendingOrders.length === 0) {
            return res.status(200).json({
                message: "No pending orders found in the given time range.",
                data: []
            });
        }

        // Tạo danh sách user_ids từ các đơn hàng
        const userIds = pendingOrders.map(order => order.user_id._id);

        // Lấy tất cả vai trò của người dùng liên quan từ bảng user_role
        const userRoles = await user_roleModel.find({ user_id: { $in: userIds } })
            .populate("role_id") // Lấy thông tin vai trò
            .lean();

        // Tạo cấu trúc map để ánh xạ user_id -> danh sách vai trò
        const userRoleMap = {};
        userRoles.forEach(userRole => {
            const userId = userRole.user_id.toString();
            if (!userRoleMap[userId]) {
                userRoleMap[userId] = [];
            }
            userRoleMap[userId].push(userRole.role_id.name);
        });

        // Tạo cấu trúc kết quả theo user, vai trò và đơn hàng
        const result = pendingOrders.map(order => ({
            user: {
                ...order.user_id,
                roles: userRoleMap[order.user_id._id.toString()] || ["Unknown Role"]
            },
            order: {
                order_date: order.oder_date,
                total_price: order.total_price,
                shipping_fee: order.shipping_fee,
                payment_method: order.payment_method,
                delivery_address: order.delivery_address,
                code: order.code,
                status: order.status
            }
        }));

        // Trả về kết quả
        res.status(200).json({
            message: "Users with pending orders retrieved successfully.",
            data: result
        });
    } catch (error) {
        console.error("Error retrieving users with pending orders:", error);
        res.status(500).json({
            message: "Error retrieving users with pending orders.",
            error: error.message
        });
    }
};
















