package com.example.petify.ui.login

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivityLoginBinding
import com.example.petify.ui.signup.SignupActivity

class LoginActivity : BaseActivity<ActivityLoginBinding,BaseViewModel>() {
    private var checkPass=false

    override fun createBinding(): ActivityLoginBinding {
      return ActivityLoginBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    override fun initView() {
        super.initView()
        binding.root.setBackgroundResource(R.drawable.bg_login)
        binding.tvLuuMk.setOnClickListener{
            checkPass=!checkPass
            if (checkPass){
                binding.tvLuuMk.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.ic_selected_savepassword,0,0,0)
            }else{
                binding.tvLuuMk.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.ic_savepassword,0,0,0)
            }
        }
        binding.tvDangky.setOnClickListener{
            val intent=Intent(this,SignupActivity::class.java)
            startActivity(intent)
        }
    }
}