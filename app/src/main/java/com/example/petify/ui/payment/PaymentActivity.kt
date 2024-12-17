package com.example.petify.ui.payment

import android.content.Intent
import android.os.Build
import android.os.StrictMode
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseActivity
import com.example.petify.R
import com.example.petify.data.server.enitities.CarrierModel
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.data.server.enitities.InvoiceDetailModelRequest
import com.example.petify.data.server.enitities.OrderModel
import com.example.petify.data.server.enitities.OrderModelRequest
import com.example.petify.data.server.enitities.UpdateQuantity
import com.example.petify.databinding.ActivityPaymentBinding
import com.example.petify.payment.zalopay.Api.CreateOrder
import com.example.petify.payment.zalopay.PaymentNotificationActivity
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.CarrierViewModel
import com.example.petify.viewmodel.CartApiViewModel
import com.example.petify.viewmodel.InvoiceDetailViewModel
import com.example.petify.viewmodel.OrderViewModel
import com.example.petify.viewmodel.ProductViewModel
import com.example.petify.viewmodel.UserViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import vn.zalopay.sdk.Environment
import vn.zalopay.sdk.ZaloPayError
import vn.zalopay.sdk.ZaloPaySDK
import vn.zalopay.sdk.listeners.PayOrderListener
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class PaymentActivity : BaseActivity<ActivityPaymentBinding, OrderViewModel>() {
    private lateinit var paymentAdapter: PaymentAdapter
    private lateinit var userViewModel: UserViewModel
    private lateinit var invoiceDetailViewModel: InvoiceDetailViewModel
    private lateinit var carrierViewmodel: CarrierViewModel
    private lateinit var cartApiViewModel: CartApiViewModel
    private lateinit var productViewModel: ProductViewModel
    private var addressUser: String? = null
    private lateinit var carrierAdapter: CarrierAdapter
    private var checkPaymentMethodZaloPay = true
    private var checkPaymentMethodCOD = false
    private var paymentMethod = "Thanh toán khi nhận hàng"
    private var carMethod = "Giao hàng tiết kiệm"
    private var shippingPrice = 10000.0
    private var selectedCarrier: CarrierModel? = null

    override fun createBinding(): ActivityPaymentBinding {
        return ActivityPaymentBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): OrderViewModel {
        return OrderViewModel()
    }

    override fun onResume() {
        super.onResume()
        val userId = SharePreUtils.getUserModel(this)!!.id
        userViewModel.getUserById(userId)


        userViewModel.user.observe(this) { user ->
            addressUser = user?.location
            binding.tvName.text = user?.name
            binding.tvPhonenumber.text = user?.phoneNumber
            binding.tvAddress.text = user?.location
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun initView() {
        super.initView()


        // Cấu hình StrictMode
        val policy = StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)

        // Khởi tạo ZaloPay SDK
        ZaloPaySDK.init(2553, Environment.SANDBOX)

        binding.tvShippingFee.text = shippingPrice.toString()
        binding.tvCOD.setOnClickListener {
            checkPaymentMethodZaloPay = false
            checkPaymentMethodCOD = true
            paymentMethod = "Thanh toán khi nhận hàng"
            binding.tvCOD.setCompoundDrawablesWithIntrinsicBounds(
                0,
                0,
                R.drawable.ic_payment_selected,
                0
            )
            binding.tvMoMo.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_payment, 0)
        }
        binding.tvMoMo.setOnClickListener {
            checkPaymentMethodZaloPay = true
            checkPaymentMethodCOD = false
            paymentMethod = "Thanh toán qua Zalo Pay"
            binding.tvCOD.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_payment, 0)
            binding.tvMoMo.setCompoundDrawablesWithIntrinsicBounds(
                0,
                0,
                R.drawable.ic_payment_selected,
                0
            )
        }
        productViewModel = ViewModelProvider(this)[ProductViewModel::class.java]
        cartApiViewModel = ViewModelProvider(this)[CartApiViewModel::class.java]
        userViewModel = ViewModelProvider(this)[UserViewModel::class.java]
        invoiceDetailViewModel = ViewModelProvider(this)[InvoiceDetailViewModel::class.java]
        val userId = SharePreUtils.getUserModel(this)!!.id
        userViewModel.getUserById(userId)

        userViewModel.user.observe(this) { user ->
            addressUser = user?.location
            binding.tvName.text = user?.name
            binding.tvPhonenumber.text = user?.phoneNumber
            binding.tvAddress.text = user?.location
        }
        binding.ivBack.setOnClickListener {
            finish()
        }
        binding.llAddress.setOnClickListener {
            val intent = Intent(this, AddressActivity::class.java)
            startActivity(intent)
        }
        val totalPrice = intent.getDoubleExtra("totalPrice", 0.0)
        val selectedItems = intent.getSerializableExtra("selectedItems") as? ArrayList<CartResponse>
        Log.d("PaymentActivity", "Total Price: $totalPrice")
        Log.d("PaymentActivity", "Selected Items: $selectedItems")

        carrierAdapter = CarrierAdapter(mutableListOf()) { carrier, price ->

            selectedCarrier = carrier // Lưu lại Carrier được chọn
            Log.d("PaymentActivity", "Selected Carrier: $selectedCarrier")
            shippingPrice =
                price.replace("đ", "").replace(".", "").toDouble() // Cập nhật phí giao hàng
            binding.tvShippingFee.text = price // Hiển thị phí giao hàng trên giao diện
            binding.tvTotalPriceHaveToPay.text = (totalPrice + shippingPrice).toString()
            binding.tvPrice.text = totalPrice.toString()
            binding.tvTotalPrice.text = (totalPrice + shippingPrice).toString()
        }
        carrierViewmodel = ViewModelProvider(this)[CarrierViewModel::class.java]
        carrierViewmodel.getListCarrier()
        carrierViewmodel.carrierList.observe(this) {
            if (it != null) {
                carrierAdapter.fillData(it)
            }
        }
        binding.rvCarrier.adapter = carrierAdapter

        paymentAdapter = PaymentAdapter(emptyList())
        binding.rvPayment.apply {
            layoutManager = LinearLayoutManager(this@PaymentActivity)
            adapter = paymentAdapter
        }
        selectedItems?.let {
            paymentAdapter.updateItems(it)
        }

        binding.btnOrder.setOnClickListener {
            if (addressUser == null && addressUser.isNullOrEmpty()) {
                Toast.makeText(this, "Vui lòng cập nhật địa chỉ", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val currentDateTime = LocalDateTime.now()
            val formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a")
            val formattedDate = currentDateTime.format(formatter)
            if (paymentMethod.equals("Thanh toán khi nhận hàng")) {
                showLoading(true)

                val order = OrderModelRequest(
                    userId,
                    formattedDate,
                    totalPrice + shippingPrice,
                    "Đang chờ xác nhận",
                    "Thanh toán khi nhận hàng",
                    addressUser!!,
                    shippingPrice,
                    carrierId = selectedCarrier!!.id
                )
                viewModel.addOrder(order)
                viewModel.order.observe(this@PaymentActivity) { order ->
                    if (order != null) {
                        Log.d("TAG123456", userId)
                        selectedItems?.let { ct ->
                            val processedItems = mutableListOf<String>() // Lưu các sản phẩm đã xử lý

                            for ((index, item) in ct.withIndex()) {
                                val originalPrice =
                                    item.productId.price * (1 - item.productId.sale / 100.0)
                                val invoiceModel = InvoiceDetailModelRequest(
                                    userId,
                                    item.productId.id,
                                    order.id,
                                    item.quantity,
                                    item.quantity * originalPrice
                                )
                                val quantityProduct = UpdateQuantity(item.quantity)

                                // Cập nhật số lượng sản phẩm
                                productViewModel.updateQuantity(item.productId.id, quantityProduct)

                                productViewModel.productQuantity.observe(this@PaymentActivity) { suc ->
                                    suc?.let {
                                        if (!it.success) {
                                            Toast.makeText(
                                                this@PaymentActivity,
                                                it.message,
                                                Toast.LENGTH_SHORT
                                            ).show()
                                        } else if (!processedItems.contains(item.id)) { // Chỉ xử lý nếu chưa xử lý
                                            processedItems.add(item.id)

                                            // Thêm chi tiết hóa đơn
                                            invoiceDetailViewModel.addInvoiceDetail(invoiceModel)

                                            // Xóa sản phẩm khỏi giỏ hàng
                                            cartApiViewModel.deleteCart(item.productId.id, userId)

                                            // Nếu là phần tử cuối cùng, kiểm tra và điều hướng
                                            if (index == ct.size - 1) {
                                                cartApiViewModel.isCartDelete.observe(this@PaymentActivity) { isDelete ->
                                                    if (isDelete) {
                                                        Log.d("TAG123456", "All items processed")
                                                        showLoading(false)
                                                        navigateToPaymentResult(
                                                            "Đặt hàng thành công",
                                                            orderModel = order
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }



                    }

                }
            } else {
                lifecycleScope.launch(Dispatchers.IO) {
                    try {
                        showLoading(true)
                        val orderApi = CreateOrder()
                        val data: JSONObject = orderApi.createOrder(
                            binding.tvTotalPriceHaveToPay.text.toString().toDouble().toInt()
                                .toString()
                        )

                        withContext(Dispatchers.Main) {
                            Log.d("TAG_API_RESPONSE", "Response from API: $data")
                            val code = data.optString("returncode", "")
                            Log.d("TAG_API_RESPONSE", "Response from API: $code")
                            if (code == "1") {
                                val token = data.optString("zptranstoken", "")
                                if (token.isNotEmpty()) {
                                    processZaloPayPayment(
                                        token,
                                        userId,
                                        addressUser,
                                        totalPrice + shippingPrice,
                                        selectedItems,
                                        shippingPrice
                                    )
                                } else {
                                    Log.e("TAG_API_RESPONSE", "Token không tồn tại hoặc rỗng")
                                }
                            } else {
                                Log.e("TAG_API_RESPONSE", "Invalid returncode: $code")
                            }
                        }
                    } catch (e: Exception) {
                        withContext(Dispatchers.Main) {
                            Log.e("TAG_API_RESPONSE", "Error: ${e.message}", e)
                        }
                    } finally {
                        showLoading(false)
                    }
                }
            }
        }
    }

    fun showLoading(isLoading: Boolean) {
        runOnUiThread {
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        Log.d("TAG_API_RESPONSE", "Received intent: $intent")
        ZaloPaySDK.getInstance().onResult(intent)
    }


    @RequiresApi(Build.VERSION_CODES.O)
    private fun processZaloPayPayment(
        token: String,
        userId: String,
        addressUser: String?,
        totalPrice: Double,
        selectedItems: ArrayList<CartResponse>?,
        shippingPrice: Double
    ) {
        val currentDateTime = LocalDateTime.now()
        val formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a")
        val formattedDate = currentDateTime.format(formatter)
        ZaloPaySDK.getInstance().payOrder(
            this@PaymentActivity, token, "demozpdk://app",
            object : PayOrderListener {
                override fun onPaymentSucceeded(s: String?, s1: String?, s2: String?) {
                    lifecycleScope.launch(Dispatchers.IO) {
                        try {
                            lifecycleScope.launch(Dispatchers.Main) {
                                showLoading(true)
                                val order = OrderModelRequest(
                                    userId,
                                    formattedDate,
                                    totalPrice + shippingPrice,
                                    "Đang chờ xác nhận",
                                    "Thanh toán qua Zalo Pay",
                                    addressUser!!,
                                    shippingPrice,
                                    carrierId = selectedCarrier!!.id
                                )
                                viewModel.addOrder(order)
                                viewModel.order.observe(this@PaymentActivity) { order ->
                                    if (order != null) {
                                        Log.d("TAG123456", userId)
                                        selectedItems?.let { ct ->
                                            val processedItems = mutableListOf<String>() // Lưu các sản phẩm đã xử lý

                                            for ((index, item) in ct.withIndex()) {
                                                val originalPrice =
                                                    item.productId.price * (1 - item.productId.sale / 100.0)
                                                val invoiceModel = InvoiceDetailModelRequest(
                                                    userId,
                                                    item.productId.id,
                                                    order.id,
                                                    item.quantity,
                                                    item.quantity * originalPrice
                                                )
                                                val quantityProduct = UpdateQuantity(item.quantity)

                                                // Cập nhật số lượng sản phẩm
                                                productViewModel.updateQuantity(item.productId.id, quantityProduct)

                                                productViewModel.productQuantity.observe(this@PaymentActivity) { suc ->
                                                    suc?.let {
                                                        if (!it.success) {
                                                            Toast.makeText(
                                                                this@PaymentActivity,
                                                                it.message,
                                                                Toast.LENGTH_SHORT
                                                            ).show()
                                                        } else if (!processedItems.contains(item.id)) { // Chỉ xử lý nếu chưa xử lý
                                                            processedItems.add(item.id)

                                                            // Thêm chi tiết hóa đơn
                                                            invoiceDetailViewModel.addInvoiceDetail(invoiceModel)

                                                            // Xóa sản phẩm khỏi giỏ hàng
                                                            cartApiViewModel.deleteCart(item.productId.id, userId)

                                                            // Nếu là phần tử cuối cùng, kiểm tra và điều hướng
                                                            if (index == ct.size - 1) {
                                                                cartApiViewModel.isCartDelete.observe(this@PaymentActivity) { isDelete ->
                                                                    if (isDelete) {
                                                                        Log.d("TAG123456", "All items processed")
                                                                        showLoading(false)
                                                                        navigateToPaymentResult(
                                                                            "Đặt hàng thành công",
                                                                            orderModel = order
                                                                        )
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }



                                    }

                                }
                            }


                        } catch (e: Exception) {
                            withContext(Dispatchers.Main) {
                                Log.d("Tag12222", e.message.toString())
                                Toast.makeText(
                                    this@PaymentActivity,
                                    "Lỗi khi lưu dữ liệu: ${e.message}",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        }
                    }
                }

                override fun onPaymentCanceled(s: String?, s1: String?) {
                    navigateToPaymentResult("Hủy thanh toán", null)
                }

                override fun onPaymentError(error: ZaloPayError?, s: String?, s1: String?) {
                    Log.e("TAG_API_RESPONSE", "Payment error: ${error?.name}, Message: $s")
                    navigateToPaymentResult("Lỗi thanh toán", null)
                }
            }
        )
    }

    private fun navigateToPaymentResult(resultMessage: String, orderModel: OrderModel? = null) {
        val intent = Intent(this@PaymentActivity, PaymentNotificationActivity::class.java)
        intent.putExtra("result", resultMessage)
        intent.putExtra("order", orderModel)
        intent.putExtra("carMethod", carMethod)
        startActivity(intent)
        finish()
    }

}