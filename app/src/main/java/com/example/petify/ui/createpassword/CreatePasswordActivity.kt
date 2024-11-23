package com.example.petify.ui.createpassword

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivityCreatePasswordBinding

class CreatePasswordActivity : BaseActivity<ActivityCreatePasswordBinding,BaseViewModel>() {
    override fun createBinding(): ActivityCreatePasswordBinding {
        return ActivityCreatePasswordBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
       return BaseViewModel()
    }

    override fun initView() {
        super.initView()
    }
}