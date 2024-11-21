package com.example.petify.ui.forgotpassword


import android.content.Intent
import android.widget.Toast
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.databinding.ActivityOtpSendBinding

class OtpSendActivity  : BaseActivity<ActivityOtpSendBinding, BaseViewModel>() {
    private var sentOtp: Int = 0

    override fun createBinding() = ActivityOtpSendBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()

        // Lấy OTP được gửi từ ForgotPasswordActivity
        sentOtp = intent.getIntExtra("otp", 0)

        binding.btnContinue.setOnClickListener {
            val enteredOtp = binding.etOtpEmail.text.toString().toIntOrNull()
            if (enteredOtp == sentOtp) {
                navigateToResetPasswordScreen()
            } else {
                Toast.makeText(this, "Invalid OTP", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun navigateToResetPasswordScreen() {
        val intent = Intent(this, NewPasswordActivity::class.java)
        intent.putExtra("email", intent.getStringExtra("email"))
        startActivity(intent)
    }
}