var express = require("express");
var router = express.Router();
const invoiceController = require("../controllers/invoice_controller");
router.get("/getListInvoice", invoiceController.getListinvoice);

router.post("/addinvoice", invoiceController.addinvoice)
router.put("/updateinvoice/:id", invoiceController.updateinvoice)
router.delete("/deleteinvoice/:id", invoiceController.deleteinvoice)
router.get("/getinvoiceById/:id", invoiceController.getinvoiceById)
router.get("/revenue-by-month/:year", invoiceController.RevenueByMonth)//Thống kê doanh thu theo từng tháng trong năm
router.get("/revenue-by-product/:year", invoiceController.RevenueByMonth)/////Thống kê doanh thu theo sản phẩm
router.get("/statisticsByDateRange", invoiceController.statisticsByDateRange)/////Thống d tổng đơn hàng, doanh thu, và top 3 sản phẩm bán chạy nhất và số lượng bán của nó trong ngày tháng năm cụ thể
router.get("/getMonthlyRevenue", invoiceController.getMonthlyRevenue)
router.get("/statisticsByDateRangeStatus", invoiceController.statisticsByDateRangeStatus)
router.get("/getAllUserOrders", invoiceController.getAllUserOrders)///Thống kê ra những đơn hàng mà nó có trạng thái là đang chừo xác nhận
router.get("/getCancelledInvoices", invoiceController.getCancelledInvoices)///Thống kê ra những đơn hàng mà nó có trạng thái là đang chừo xác nhận


router.get("/getinvoiceByIdUser/:id", invoiceController.getInvoiceByIdUser)
module.exports = router;