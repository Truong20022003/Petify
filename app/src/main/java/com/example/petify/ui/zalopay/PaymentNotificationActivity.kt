package com.example.petify.ui.zalopay

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivityPaymentNotificationBinding

class PaymentNotificationActivity :
    BaseActivity<ActivityPaymentNotificationBinding, BaseViewModel>() {

    override fun createBinding() = ActivityPaymentNotificationBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()


    override fun initView() {
        super.initView()


        val intent = intent
        binding.textViewNotify.text = intent.getStringExtra("result")

    }
}