package com.example.petify.ui.forgotpassword


import android.content.Intent
import android.widget.Toast
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.databinding.ActivityOtpSendBinding
import com.example.petify.ultils.Constans
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthProvider

class OtpSendActivity  : BaseActivity<ActivityOtpSendBinding, BaseViewModel>() {
    private var sentOtp: Int = 0

    override fun createBinding() = ActivityOtpSendBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()

        val verificationId = intent.getStringExtra(Constans.INTENT_VERIFICATION_ID)

        binding.btnContinue.setOnClickListener {
            val enteredOtp = binding.etOtp.text.toString().trim()
            if (enteredOtp.isEmpty() || verificationId == null) {
                Toast.makeText(this, "Please enter the OTP", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            verifyOtp(verificationId, enteredOtp)
        }
    }

    private fun verifyOtp(verificationId: String, otp: String) {
        val credential = PhoneAuthProvider.getCredential(verificationId, otp)
        FirebaseAuth.getInstance().signInWithCredential(credential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    // Chuyển sang màn hình nhập mật khẩu mới
                    navigateToNewPasswordActivity()
                } else {
                    Toast.makeText(this, "Invalid OTP", Toast.LENGTH_SHORT).show()
                }
            }
    }

    private fun navigateToNewPasswordActivity() {
        val phoneNumber = intent.getStringExtra(Constans.INTENT_PHONE_NUMBER)
        val intent = Intent(this, NewPasswordActivity::class.java)
        intent.putExtra(Constans.INTENT_PHONE_NUMBER, phoneNumber)
        startActivity(intent)
        finish()
    }

}