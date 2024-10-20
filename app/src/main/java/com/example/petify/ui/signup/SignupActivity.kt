package com.example.petify.ui.signup

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivitySignupBinding

class SignupActivity : BaseActivity<ActivitySignupBinding,BaseViewModel>() {
    override fun createBinding(): ActivitySignupBinding {
        return ActivitySignupBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
      return BaseViewModel()
    }

    override fun initView() {
        super.initView()
        binding.root.setBackgroundResource(R.drawable.bg_signup)
    }

}