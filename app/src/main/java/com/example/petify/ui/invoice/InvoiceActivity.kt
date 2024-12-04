package com.example.petify.ui.invoice

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivityInvoiceBinding

class InvoiceActivity : BaseActivity<ActivityInvoiceBinding, BaseViewModel>() {

    override fun createBinding() = ActivityInvoiceBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()


    override fun initView() {
        super.initView()



    }
}