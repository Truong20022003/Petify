package com.example.petify.ui.forgotpassword

import android.content.Intent
import android.util.Log
import android.widget.Toast
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.databinding.ActivityForgotPasswordBinding
import com.example.petify.ultils.Constans
import com.google.firebase.FirebaseException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import java.util.concurrent.TimeUnit

class ForgotPasswordActivity : BaseActivity<ActivityForgotPasswordBinding, BaseViewModel>(){
    private lateinit var firebaseAuth: FirebaseAuth

    override fun createBinding() = ActivityForgotPasswordBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()
        binding.btnContinue.setOnClickListener {
            val phoneNumberInput = binding.etOtpSMS.text.toString().trim()
            if (phoneNumberInput.isEmpty()) {
                Toast.makeText(this, "Vui lòng nhập số điện thoại", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val phoneNumber = if (phoneNumberInput.startsWith("0")) {
                "+84" + phoneNumberInput.substring(1)
            } else {
                phoneNumberInput
            }
            sendOtpToPhoneNumber(phoneNumber)
        }
    }
    private fun sendOtpToPhoneNumber(phoneNumber: String) {
        val options = PhoneAuthOptions.newBuilder(FirebaseAuth.getInstance())
            .setPhoneNumber(phoneNumber)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(this)
            .setCallbacks(object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
                override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                }

                override fun onVerificationFailed(e: FirebaseException) {
                    Log.d("Firebase", "OTP verification failed: ${e.message}")
                    Toast.makeText(this@ForgotPasswordActivity, "Failed to send OTP: ${e.message}", Toast.LENGTH_SHORT).show()
                }

                override fun onCodeSent(verificationId: String, token: PhoneAuthProvider.ForceResendingToken) {
                    super.onCodeSent(verificationId, token)
                    navigateToOtpActivity(phoneNumber, verificationId)
                }
            })
            .build()

        PhoneAuthProvider.verifyPhoneNumber(options)
    }

    private fun navigateToOtpActivity(phoneNumber: String, verificationId: String) {
        val intent = Intent(this, OtpSendActivity::class.java)
        intent.putExtra(Constans.INTENT_PHONE_NUMBER, phoneNumber)
        intent.putExtra(Constans.INTENT_VERIFICATION_ID, verificationId)
        startActivity(intent)
        finish()
    }

}