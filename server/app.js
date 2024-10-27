var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var carrierRouter = require('./routes/carrier_router');
var categoryRouter = require('./routes/category_router');
var invoice_detailRouter = require('./routes/invoice_detail_router');
var invoiceRouter = require('./routes/invoice_router');
var notificationRouter = require('./routes/notification_router');
var notification_userRouter = require('./routes/notification_user_router');
var orderRouter = require('./routes/order_router');
var product_categoryRouter = require('./routes/product_category_router');
var productRouter = require('./routes/product_router');
var review_productRouter = require('./routes/review_product_router');
var reviewRouter = require('./routes/review_router');
var roleRouter = require('./routes/role_router');
var supplierRouter = require('./routes/supplier_router');
var user_roleRouter = require('./routes/user_role_router');
var userRouter = require('./routes/user_router');

var app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Cho phép tất cả các origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Các phương thức được phép
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Các header được phép
  next(); // Chuyển tiếp đến middleware tiếp theo
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/carrierRouter",carrierRouter)
app.use("/categoryRouter",categoryRouter)
app.use("/invoiceDetail",invoice_detailRouter)
app.use("/invoice",invoiceRouter)
app.use("/notification",notificationRouter)
app.use("/notificationUser",notification_userRouter)
app.use("/oder",orderRouter)
app.use("/productCategory",product_categoryRouter)
app.use("/product",productRouter)
app.use("/reviewProduct",review_productRouter)
app.use("/review",reviewRouter)
app.use("/role",roleRouter)
app.use("/supplier",supplierRouter)
app.use("/userRole",user_roleRouter)
app.use("/user",userRouter)
var userRouter = require('./routes/user_router')
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
