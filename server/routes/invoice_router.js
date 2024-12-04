var express = require("express");
var router = express.Router();
const invoiceController = require("../controllers/invoice_controller");
router.get("/getListInvoice", invoiceController.getListinvoice);

router.post("/addinvoice", invoiceController.addinvoice)
router.put("/updateinvoice/:id", invoiceController.updateinvoice)
router.delete("/deleteinvoice/:id", invoiceController.deleteinvoice)
router.get("/getinvoiceById/:id", invoiceController.getinvoiceById)
router.get("/revenue-by-payment-method", invoiceController.RevenueByPaymentMethod)
router.get("/revenue-by-date", invoiceController.RevenueByDate)
router.get("/revenue-by-date-range", invoiceController.RevenueByDateRange)
router.get("/invoices-by-month", invoiceController.InvoicesByMonth)
router.get("/revenue-by-month/:year", invoiceController.RevenueByMonth)//Thống kê doanh thu theo từng tháng trong năm
router.get("/revenue-by-product/:year", invoiceController.RevenueByMonth)/////Thống kê doanh thu theo sản phẩm
router.get("/top-products", invoiceController.TopProducts)/////Top 5 sản phẩm bán chạy nhất theo tháng và năm
router.get("/statistics_by_date", invoiceController.statisticsByDate)/////Thống d tổng đơn hàng, doanh thu, và top 3 sản phẩm bán chạy nhất và số lượng bán của nó trong ngày tháng năm cụ thể

router.get("/getinvoiceByIdUser/:id",invoiceController.getInvoiceByIdUser)
module.exports = router;