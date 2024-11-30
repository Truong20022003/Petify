package com.example.petify.ui.payment

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.data.server.enitities.InvoiceDetailModel
import com.example.petify.data.server.enitities.InvoiceModel
import com.example.petify.data.server.enitities.OrderModel
import com.example.petify.databinding.ActivityPaymentBinding
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.InvoiceDetailViewModel
import com.example.petify.viewmodel.OrderViewModel
import com.example.petify.viewmodel.UserViewModel

class PaymentActivity : BaseActivity<ActivityPaymentBinding, OrderViewModel>() {
    private lateinit var paymentAdapter: PaymentAdapter
    private lateinit var userViewModel: UserViewModel
    private lateinit var invoiceDetailViewModel: InvoiceDetailViewModel
    private var addressUser: String? = null
    override fun createBinding(): ActivityPaymentBinding {
        return ActivityPaymentBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): OrderViewModel {
        return OrderViewModel()
    }

    override fun initView() {
        super.initView()
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
        binding.rvPayment.apply {
            layoutManager = LinearLayoutManager(this@PaymentActivity)
            adapter = paymentAdapter
        }
        selectedItems?.let {
            paymentAdapter.updateItems(it)
        }
        binding.btnOrder.setOnClickListener {
            if (addressUser!!.isEmpty()) {
                Toast.makeText(this, "Vui lòng cập nhật địa chỉ", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.addOrder(
                    OrderModel(
                        "",
                        userId,
                        addressUser!!,
                        totalPrice,
                        "Đang chờ xác nhận"
                    )
                )
                selectedItems?.let {
                   for (item in it) {
                       val invoiceModel =  InvoiceDetailModel(
                           "",
                           userId,
                           item.id,
                           item.quantity,
                           item.quantity * item.price
                       )
                       invoiceDetailViewModel.addInvoiceDetail(invoiceModel)
                   }
                }
 

            }
        }
    }
}