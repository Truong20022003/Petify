const { invoiceModel } = require("../models/invoice_model")
const { invoice_detailModel } = require("../models/invoice_detail_model")
const { productModel } = require("../models/product_model")

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

/////thống ốngkee theo phương thức thanh toán
exports.RevenueByPaymentMethod = async (req, res, next) => {
    try {
        const { year } = req.query; // Lấy năm từ query string
        if (!year) {
            return res.status(400).json({ message: "Year is required" });
        }

        const result = await invoiceModel.aggregate([
            {
                $match: {
                    date: { $regex: `^${year}` } // Lọc các hóa đơn có năm bắt đầu bằng giá trị truyền vào
                }
            },
            {
                $group: {
                    _id: "$payment_method", // Nhóm theo phương thức thanh toán
                    totalRevenue: { $sum: "$total" } // Tính tổng doanh thu
                }
            },
            {
                $sort: { totalRevenue: -1 } // Sắp xếp giảm dần theo doanh thu
            }
        ]);

        // Định dạng lại dữ liệu trả về
        const formattedResult = result.map(item => ({
            paymentMethod: item._id,
            revenue: item.totalRevenue
        }));

        res.status(200).json(formattedResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating revenue" });
    }
}

// tính doanh thu theo từng ngày từng tháng 
exports.RevenueByDate = async (req, res, next) => {
    try {
        const result = await invoiceModel.aggregate([
            {
                $group: {
                    _id: { $substr: ["$date", 0, 10] }, // Lấy ngày (yyyy-MM-dd)
                    totalRevenue: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } } // Sắp xếp theo ngày tăng dần
        ]);

        const formattedResult = result.map(item => ({
            date: item._id,
            revenue: item.totalRevenue
        }));

        res.status(200).json(formattedResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating revenue by date" });
    }
}
exports.RevenueByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        // Đảm bảo rằng startDate và endDate có định dạng yyyy-mm-dd
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required." });
        }

        // Truy vấn dữ liệu trong khoảng thời gian
        const invoices = await invoiceModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,  // So sánh với ngày bắt đầu
                        $lte: endDate     // So sánh với ngày kết thúc
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalInvoices: { $sum: 1 },
                    totalRevenue: { $sum: { $toDouble: "$total" } }
                }
            }
        ]);

        res.json(invoices[0] || { totalInvoices: 0, totalRevenue: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
exports.InvoicesByMonth = async (req, res, next) => {
    try {
        const invoicesByMonth = await invoiceModel.aggregate([
            {
                $group: {
                    _id: { $substr: ["$date", 0, 7] }, // Lấy năm-tháng từ date (yyyy-MM)
                    count: { $sum: 1 } // Đếm số hóa đơn
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json(invoicesByMonth);
    } catch (error) {
        console.error("Error fetching invoices by month:", error);
        res.status(500).json({ message: "Server error" });
    }
}
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
                    // Lọc các hóa đơn trong năm người dùng nhập vào
                    date: { $regex: `^${year}` }
                }
            },
            {
                $project: {
                    // Tách năm và tháng từ trường `date`
                    year: { $substr: ["$date", 0, 4] },
                    month: { $substr: ["$date", 5, 2] },
                    total: 1
                }
            },
            {
                $group: {
                    // Nhóm theo tháng
                    _id: "$month",
                    totalRevenue: { $sum: "$total" },
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
            const month = parseInt(item._id) - 1; // Lấy tháng (0-11)
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
}
/////doanh thu theo sản phẩm
exports.TopProducts = async (req, res, next) => {
    const { month, year } = req.query; // Lấy tháng và năm từ query (ví dụ: 2024-11)

    if (!month || !year) {
        return res.status(400).json({ message: "Month and year are required" });
    }

    try {
        // Bước 1: Lọc các hóa đơn trong tháng và năm
        const startOfMonth = `${year}-${month}-01`; // Ngày bắt đầu
        const endOfMonth = `${year}-${month}-31`;   // Ngày kết thúc (giả định tháng có 31 ngày)

        const invoicesInMonth = await invoiceModel.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (!invoicesInMonth.length) {
            return res.status(200).json([]); // Trả về mảng rỗng
        }

        // Lấy danh sách `invoice_id` trong tháng
        const invoiceIds = invoicesInMonth.map(invoice => invoice._id);

        // Bước 2: Lọc và nhóm dữ liệu từ bảng `invoice_detail`
        const result = await invoice_detailModel.aggregate([
            { $match: { invoice_id: { $in: invoiceIds } } }, // Chỉ lấy các sản phẩm trong hóa đơn thuộc tháng
            {
                $group: {
                    _id: "$product_id", // Nhóm theo sản phẩm
                    totalQuantity: { $sum: "$quantity" }, // Tổng số lượng bán
                    totalPrice: { $sum: "$total_price" } // Tổng giá trị bán
                }
            },
            { $sort: { totalQuantity: -1 } }, // Sắp xếp giảm dần theo số lượng
            { $limit: 5 } // Lấy top 5 sản phẩm
        ]);

        // Bước 3: Kết nối với bảng `product` để lấy tên sản phẩm
        const topProducts = await Promise.all(
            result.map(async item => {
                const product = await productModel.findById(item._id); // Lấy thông tin sản phẩm
                return {
                    productName: product ? product.name : "Unknown",
                    totalQuantity: item.totalQuantity,
                    totalPrice: item.totalPrice
                };
            })
        );

        res.status(200).json(topProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching top products" });
    }
}

////Thống d tổng đơn hàng, doanh thu, và sản phẩm  và số lượng bán của nó trong ngày tháng năm cụ thể
exports.statisticsByDate = async (req, res, next) => {
    try {
        // Lấy tham số ngày, tháng, năm từ request
        const { year, month, day } = req.query;

        if (!year || !month || !day) {
            return res.status(400).json({
                message: "Please provide year, month, and day."
            });
        }

        // Xác định khoảng thời gian (bắt đầu và kết thúc trong ngày)
        const startDate = new Date(year, month - 1, day, 0, 0, 0);
        const endDate = new Date(year, month - 1, day, 23, 59, 59);

        // Lấy danh sách sản phẩm được bán ra trong ngày tháng năm đó
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
                $match: {
                    // Chỉ lấy các hóa đơn trong khoảng thời gian ngày, tháng, năm yêu cầu
                    "invoice_info.date": {
                        $gte: startDate.toISOString(),
                        $lt: endDate.toISOString()
                    }
                }
            },
            {
                $group: {
                    _id: "$product_id", // Nhóm theo ID sản phẩm
                    totalQuantity: { $sum: "$quantity" } // Tính tổng số lượng bán ra của sản phẩm
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
                            { totalQuantity: "$totalQuantity" } // Thêm tổng số lượng bán ra
                        ]
                    }
                }
            },
            {
                $replaceRoot: { newRoot: "$product_info" } // Thay thế root bằng toàn bộ thông tin sản phẩm
            },
            {
                $sort: { totalQuantity: -1 } // Sắp xếp sản phẩm theo số lượng bán ra (giảm dần)
            }
        ]);

        // Tính tổng số đơn hàng và tổng doanh thu
        const summary = await invoiceModel.aggregate([
            {
                $match: {
                    // Chỉ lấy hóa đơn trong khoảng thời gian ngày, tháng, năm yêu cầu
                    date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() }
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
            topProducts: productStats // Danh sách sản phẩm bán ra trong ngày
        });
    } catch (error) {
        console.error("Error in statisticsByDate:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
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
