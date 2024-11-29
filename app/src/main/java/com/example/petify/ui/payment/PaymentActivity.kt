package com.example.petify.ui.payment

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.databinding.ActivityPaymentBinding

class PaymentActivity : BaseActivity<ActivityPaymentBinding, BaseViewModel>() {
    private lateinit var paymentAdapter: PaymentAdapter
    override fun createBinding(): ActivityPaymentBinding {
        return ActivityPaymentBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    override fun initView() {
        super.initView()
        binding.ivBack.setOnClickListener {
            finish()
        }
        binding.llAddress.setOnClickListener{
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
//            for (item in selectedItems) {
//                cartViewModel.removeFromCart(item.id)
//            }

            
        }
    }
}