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
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.data.server.enitities.InvoiceDetailModelRequest
import com.example.petify.data.server.enitities.OrderModel
import com.example.petify.data.server.enitities.OrderModelRequest
import com.example.petify.databinding.ActivityPaymentBinding
import com.example.petify.payment.zalopay.Api.CreateOrder
import com.example.petify.payment.zalopay.PaymentNotificationActivity
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.CartApiViewModel
import com.example.petify.viewmodel.InvoiceDetailViewModel
import com.example.petify.viewmodel.OrderViewModel
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
    private lateinit var cartApiViewModel: CartApiViewModel
    private var addressUser: String? = null
    private lateinit var carrierAdapter: CarrierAdapter
    private var checkPaymentMethodZaloPay = true
    private var checkPaymentMethodCOD = false
    private var checkPaymentGHN = false
    private var checkPaymentGHTK = true
    private var paymentMethod = ""
    private var carMethod = "Giao hàng tiết kiệm"
    private var shippingPrice = 10000.0
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
        binding.tvTotalPriceHaveToPay.text = (totalPrice + shippingPrice).toString()
        binding.tvPrice.text = totalPrice.toString()
        binding.tvTotalPrice.text = (totalPrice + shippingPrice).toString()
        binding.tvGHN.setOnClickListener {
            checkPaymentGHN = true
            checkPaymentGHTK = false
            shippingPrice = 20000.0
            carMethod = "Giao hàng tiết kiệm"
            binding.tvShippingFee.text = shippingPrice.toString()
            binding.tvTotalPrice.text = (totalPrice + shippingPrice).toString()
            binding.tvTotalPriceHaveToPay.text = (totalPrice + shippingPrice).toString()
            binding.tvGHN.setCompoundDrawablesWithIntrinsicBounds(
                0,
                0,
                R.drawable.ic_payment_selected,
                0
            )
            binding.tvGHTK.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_payment, 0)
        }
        binding.tvGHTK.setOnClickListener {
            checkPaymentGHN = false
            checkPaymentGHTK = true
            shippingPrice = 10000.0
            carMethod = "Giao hàng nhanh"
            binding.tvShippingFee.text = shippingPrice.toString()
            binding.tvTotalPrice.text = (totalPrice + shippingPrice).toString()
            binding.tvTotalPriceHaveToPay.text = (totalPrice + shippingPrice).toString()
            binding.tvGHN.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_payment, 0)
            binding.tvGHTK.setCompoundDrawablesWithIntrinsicBounds(
                0,
                0,
                R.drawable.ic_payment_selected,
                0
            )
        }
        paymentAdapter = PaymentAdapter(emptyList())
        binding.rvPayment.apply {
            layoutManager = LinearLayoutManager(this@PaymentActivity)
            adapter = paymentAdapter
        }
        selectedItems?.let {
            paymentAdapter.updateItems(it)
        }

        binding.btnOrder.setOnClickListener {
            val currentDateTime = LocalDateTime.now()
            val formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a")
            val formattedDate = currentDateTime.format(formatter)
            if (paymentMethod.equals("Thanh toán khi nhận hàng")) {
                val order = OrderModelRequest(
                    userId,
                    formattedDate,
                    totalPrice,
                    "Đang chờ xác nhận",
                    "Thanh toán khi nhận hàng",
                    addressUser!!,
                    shippingPrice,
                    "67068264ecffca4b44fdef77"
                )
                viewModel.addOrder(order)
                viewModel.order.observe(this) { order ->
                    Log.d("TAG123456", userId)
                    if (order!!.id != null) {
                        selectedItems?.let {
                            for (item in it) {
                                val originalPrice = item.productId.price * (1 - item.productId.sale / 100.0)
                                val invoiceModel = InvoiceDetailModelRequest(
                                    userId,
                                    item.productId.id,
                                    order.id,
                                    item.quantity,
                                    item.quantity * originalPrice
                                )
                                invoiceDetailViewModel.addInvoiceDetail(invoiceModel)
                                cartApiViewModel.deleteCart(item.productId.id, userId)
                            }

                        }
                        navigateToPaymentResult("Đặt hàng thành công", orderModel = order)
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
                                        totalPrice,
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

    private fun processZaloPayPayment(
        token: String,
        userId: String,
        addressUser: String?,
        totalPrice: Double,
        selectedItems: ArrayList<CartResponse>?,
        shippingPrice: Double
    ) {
        ZaloPaySDK.getInstance().payOrder(
            this@PaymentActivity, token, "demozpdk://app",
            object : PayOrderListener {
                override fun onPaymentSucceeded(s: String?, s1: String?, s2: String?) {
                    lifecycleScope.launch(Dispatchers.IO) {
                        try {
                            lifecycleScope.launch(Dispatchers.Main) {
                                val order = OrderModelRequest(
                                    userId,
                                    addressUser!!,
                                    totalPrice,
                                    "Đang chờ xác nhận",
                                    "Thanh toán qua Zalo Pay",
                                    addressUser,
                                    shippingPrice,
                                    "67068264ecffca4b44fdef77"
                                )
                                viewModel.addOrder(order)
                                viewModel.order.observe(this@PaymentActivity) { order ->
                                    if (order != null) {
                                        Log.d("TAG123456", userId)
                                        selectedItems?.let {
                                            for (item in it) {
                                                val invoiceModel = InvoiceDetailModelRequest(
                                                    userId,
                                                    item.id,
                                                    order.id,
                                                    item.quantity,
                                                    item.quantity * item.productId.price
                                                )
                                                invoiceDetailViewModel.addInvoiceDetail(invoiceModel)
                                                cartApiViewModel.deleteCart(item.id, userId)
                                            }

                                        }
                                        navigateToPaymentResult(
                                            "Đặt hàng thành công",
                                            orderModel = order
                                        )
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
                    navigateToPaymentResult("Hủy thanh toán",null)
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
        intent.putExtra("carMethod",carMethod)
        startActivity(intent)
        finish()
    }

}