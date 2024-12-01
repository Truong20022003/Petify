package com.example.petify.ui.forgotpassword

import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivityNewPasswordBinding
import com.example.petify.ultils.Constans
import com.example.petify.viewmodel.UserViewModel
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import java.util.concurrent.TimeUnit

class NewPasswordActivity : BaseActivity<ActivityNewPasswordBinding, UserViewModel>() {
    override fun createBinding() = ActivityNewPasswordBinding.inflate(layoutInflater)

    override fun setViewModel() = UserViewModel()

    override fun initView() {
        super.initView()
//
        val phoneNumber = intent.getStringExtra(Constans.INTENT_PHONE_NUMBER) ?: ""
        binding.btnContinue.setOnClickListener {
            val newPassword = binding.etNewPassword.text.toString().trim()
            val confirmPassword = binding.etReNewPassword.text.toString().trim()

            if (newPassword.isEmpty() || confirmPassword.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (newPassword != confirmPassword) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Gọi API để đổi mật khẩu
            viewModel.changePassword(phoneNumber, newPassword)
            finish()
        }

    }

}