package com.example.petify.ui.zalopay

import android.content.Intent
import android.os.StrictMode
import android.util.Log
import android.view.View
import androidx.lifecycle.lifecycleScope
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.databinding.ActivityOrderPaymentBinding
import com.example.petify.ui.zalopay.Api.CreateOrder
import com.example.petify.view.tap
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import vn.zalopay.sdk.Environment
import vn.zalopay.sdk.ZaloPayError
import vn.zalopay.sdk.ZaloPaySDK
import vn.zalopay.sdk.listeners.PayOrderListener

class OrderPaymentActivity : BaseActivity<ActivityOrderPaymentBinding, BaseViewModel>() {

    override fun createBinding() = ActivityOrderPaymentBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()

        // Cấu hình StrictMode
        val policy = StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)

        // Khởi tạo ZaloPay SDK
        ZaloPaySDK.init(2553, Environment.SANDBOX)

        val intent = intent
        binding.textViewSoluong.text = intent.getStringExtra("soluong")
        val total = intent.getDoubleExtra("total", 0.0)
        val totalString = String.format("%.0f", total)
        binding.textViewTongTien.text = total.toString()


        binding.buttonThanhToan.tap {
            lifecycleScope.launch(Dispatchers.IO) {
                try {
                    showLoading(true)
                    val orderApi = CreateOrder()
                    val data: JSONObject = orderApi.createOrder(totalString)

                    withContext(Dispatchers.Main) {
                        Log.d("TAG_API_RESPONSE", "Response from API: $data")
                        val code = data.optString("returncode", "")
                        if (code == "1") {
                            val token = data.optString("zptranstoken", "")
                            if (token.isNotEmpty()) {
                                processZaloPayPayment(token)
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
    }


    private fun processZaloPayPayment(token: String) {
        ZaloPaySDK.getInstance().payOrder(
            this@OrderPaymentActivity, token, "demozpdk://app",
            object : PayOrderListener {
                override fun onPaymentSucceeded(s: String?, s1: String?, s2: String?) {
                    navigateToPaymentResult("Thanh toán thành công")
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
        val intent = Intent(this@OrderPaymentActivity, PaymentNotificationActivity::class.java)
        intent.putExtra("result", resultMessage)
        startActivity(intent)
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


}