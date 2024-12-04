var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cors = require("cors"); // Import module cors
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
var cartRouter = require('./routes/cart_router');
var favoritesRouter = require('./routes/favorites_router');
var userRouter = require('./routes/user_router');
var app = express();

// Middleware kiểm tra header Authorization
function checkHeader(req, res, next) {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader || authorizationHeader !== "trinh_nhung") {
    // Nếu thiếu header hoặc header không đúng, trả về lỗi
    return res.status(403).json({ message: "Forbidden: Missing or incorrect Authorization header" });
  }

  next(); // Tiếp tục nếu header hợp lệ
}

app.use(cors({
  origin: '*',
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(checkHeader);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use('/users', checkHeader, usersRouter);
app.use("/carrier", checkHeader, carrierRouter)
app.use("/cart", checkHeader, cartRouter)
app.use("/favorites", checkHeader, favoritesRouter)
app.use("/category", checkHeader, categoryRouter)
app.use("/invoiceDetail", checkHeader, invoice_detailRouter)
app.use("/invoice", checkHeader, invoiceRouter)
app.use("/notification", checkHeader, notificationRouter)
app.use("/notificationUser", checkHeader, notification_userRouter)
app.use("/order", checkHeader, orderRouter)
app.use("/productCategory", checkHeader, product_categoryRouter)
app.use("/product", checkHeader, productRouter)
app.use("/reviewProduct", checkHeader, review_productRouter)
app.use("/review", checkHeader, reviewRouter)
app.use("/role", checkHeader, roleRouter)
app.use("/supplier", checkHeader, supplierRouter)
app.use("/userRole", checkHeader, user_roleRouter)
app.use("/user", checkHeader, userRouter)
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
