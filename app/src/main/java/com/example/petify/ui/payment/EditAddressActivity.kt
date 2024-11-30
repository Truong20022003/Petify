package com.example.petify.ui.payment

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivityEditAddressBinding

class EditAddressActivity : BaseActivity<ActivityEditAddressBinding,BaseViewModel>() {
    override fun createBinding(): ActivityEditAddressBinding {
        return ActivityEditAddressBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    override fun initView() {
        super.initView()

    }
}