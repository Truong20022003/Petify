package com.example.petify.ui.forgotpassword

import android.content.Intent
import android.widget.Toast
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.databinding.ActivityForgotPasswordBinding
import com.google.firebase.auth.FirebaseAuth

class ForgotPasswordActivity : BaseActivity<ActivityForgotPasswordBinding, BaseViewModel>(){
    private lateinit var firebaseAuth: FirebaseAuth

    override fun createBinding() = ActivityForgotPasswordBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()

        // Khởi tạo FirebaseAuth
        firebaseAuth = FirebaseAuth.getInstance()

        // Xử lý sự kiện khi nhấn nút "Send Reset Email"
        binding.etOtpEmail.setOnClickListener {
            val email = binding.etOtpEmail.text.toString().trim()
            if (email.isEmpty()) {
                Toast.makeText(this, "Please enter your email", Toast.LENGTH_SHORT).show()
            } else {
                sendOtpToEmail(email)
            }
        }
    }

    private fun sendOtpToEmail(email: String) {
        if (email.isEmpty()) {
            Toast.makeText(this, "Please enter your email", Toast.LENGTH_SHORT).show()
            return
        }

        // Gửi OTP qua server
        val otp = (100000..999999).random() // Tạo OTP ngẫu nhiên

        Toast.makeText(this, "OTP sent to $email", Toast.LENGTH_SHORT).show()
        navigateToVerifyOtpScreen(email, otp)
    }

    private fun navigateToVerifyOtpScreen(email: String, otp: Int) {
        val intent = Intent(this, OtpSendActivity::class.java)
        intent.putExtra("email", email)
        intent.putExtra("otp", otp)
        startActivity(intent)
    }
}