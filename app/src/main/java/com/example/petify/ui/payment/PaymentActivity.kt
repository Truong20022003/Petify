package com.example.petify.ui.payment

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.StrictMode
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.data.server.enitities.InvoiceDetailModel
import com.example.petify.data.server.enitities.InvoiceModel
import com.example.petify.data.server.enitities.OrderModel
import com.example.petify.databinding.ActivityPaymentBinding
import com.example.petify.payment.zalopay.Api.CreateOrder
import com.example.petify.payment.zalopay.PaymentNotificationActivity
import com.example.petify.ultils.SharePreUtils
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

class PaymentActivity : BaseActivity<ActivityPaymentBinding, OrderViewModel>() {
    private lateinit var paymentAdapter: PaymentAdapter
    private lateinit var userViewModel: UserViewModel
    private lateinit var invoiceDetailViewModel: InvoiceDetailViewModel
    private var addressUser: String? = null
    private lateinit var carrierAdapter: CarrierAdapter
    private var checkPaymentMethodZaloPay = false
    private var checkPaymentMethodCOD = true
    private var paymentMethod = ""
    override fun createBinding(): ActivityPaymentBinding {
        return ActivityPaymentBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): OrderViewModel {
        return OrderViewModel()
    }

    override fun initView() {
        super.initView()
        // Cấu hình StrictMode
        val policy = StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)

        // Khởi tạo ZaloPay SDK
        ZaloPaySDK.init(2553, Environment.SANDBOX)
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
        userViewModel = ViewModelProvider(this)[UserViewModel::class.java]
        invoiceDetailViewModel = ViewModelProvider(this)[InvoiceDetailViewModel::class.java]
        val userId = SharePreUtils.getUserModel(this)!!.id
        userViewModel.getUserById(userId)

        userViewModel.user.observe(this) { user ->
            addressUser = user?.location
        }
        binding.ivBack.setOnClickListener {
            finish()
        }
        binding.llAddress.setOnClickListener {
            val intent = Intent(this, AddressActivity::class.java)
            startActivity(intent)
        }
        val totalPrice = intent.getDoubleExtra("totalPrice", 0.0)
        val selectedItems = intent.getSerializableExtra("selectedItems") as? ArrayList<CartItem>
        Log.d("PaymentActivity", "Total Price: $totalPrice")
        Log.d("PaymentActivity", "Selected Items: $selectedItems")
        paymentAdapter = PaymentAdapter(emptyList())
//        carrierAdapter = CarrierAdapter(emptyList(),object : CarrierAdapter.OnItemClickListener{})
        binding.rvPayment.apply {
            layoutManager = LinearLayoutManager(this@PaymentActivity)
            adapter = paymentAdapter
        }
        selectedItems?.let {
            paymentAdapter.updateItems(it)
        }
        binding.btnOrder.setOnClickListener {
            if (paymentMethod.equals("Thanh toán khi nhận hàng")) {
                viewModel.addOrder(
                    OrderModel(
                        "",
                        userId,
                        addressUser!!,
                        totalPrice,
                        "Đang chờ xác nhận",
                        paymentMethod,
                        addressUser!!,
                        0.0,
                        ""
                    )
                )
                selectedItems?.let {
                    for (item in it) {
                        val invoiceModel = InvoiceDetailModel(
                            "",
                            userId,
                            item.id,
                            item.quantity,
                            item.quantity * item.price
                        )
                        invoiceDetailViewModel.addInvoiceDetail(invoiceModel)
                    }
                }
            }else{
                lifecycleScope.launch(Dispatchers.IO) {
                    try {
                        showLoading(true)
                        val orderApi = CreateOrder()
                        val data: JSONObject = orderApi.createOrder(totalPrice.toInt().toString())

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
                                        selectedItems
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
                        showLoading(false) // Ẩn ProgressBar
                    }
                }
            }
//            if (addressUser!!.isEmpty()) {
//                Toast.makeText(this, "Vui lòng cập nhật địa chỉ", Toast.LENGTH_SHORT).show()
//            } else {

            //   userId: String,
            //        addressUser: String?,
            //        totalPrice: Double,
            //        selectedItems: ArrayList<CartItem>?


//            }
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
        selectedItems: ArrayList<CartItem>?
    ) {
        ZaloPaySDK.getInstance().payOrder(
            this@PaymentActivity, token, "demozpdk://app",
            object : PayOrderListener {
                override fun onPaymentSucceeded(s: String?, s1: String?, s2: String?) {
                    lifecycleScope.launch(Dispatchers.IO) {
                        try {
                            // Thêm đơn hàng
                            viewModel.addOrder(
                                OrderModel(
                                    "",
                                    userId,
                                    addressUser!!,
                                    totalPrice,
                                    "Đang chờ xác nhận",
                                    "Thanh toán qua Zalo Pay",
                                    addressUser,
                                    0.0,
                                    ""
                                )
                            )

                            // Thêm chi tiết hóa đơn
                            selectedItems?.forEach { item ->
                                val invoiceModel = InvoiceDetailModel(
                                    "",
                                    userId,
                                    item.id,
                                    item.quantity,
                                    item.quantity * item.price
                                )
                                invoiceDetailViewModel.addInvoiceDetail(invoiceModel)
                            }

                            withContext(Dispatchers.Main) {
                                navigateToPaymentResult("Thanh toán thành công")
                            }
                        } catch (e: Exception) {
                            withContext(Dispatchers.Main) {
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
                    navigateToPaymentResult("Hủy thanh toán")
                }

                override fun onPaymentError(error: ZaloPayError?, s: String?, s1: String?) {
                    Log.e("TAG_API_RESPONSE", "Payment error: ${error?.name}, Message: $s")
                    navigateToPaymentResult("Lỗi thanh toán")
                }
            }
        )
    }

    private fun navigateToPaymentResult(resultMessage: String) {
        val intent = Intent(this@PaymentActivity, PaymentNotificationActivity::class.java)
        intent.putExtra("result", resultMessage)
        startActivity(intent)
    }
}