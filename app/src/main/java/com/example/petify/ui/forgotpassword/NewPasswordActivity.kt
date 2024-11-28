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

class NewPasswordActivity : BaseActivity<ActivityNewPasswordBinding, BaseViewModel>() {
    override fun createBinding() = ActivityNewPasswordBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()

        binding.btnContinue.setOnClickListener {
            val newPassword = binding.etNewPassword.text.toString()
            val confirmPassword = binding.etReNewPassword.text.toString()

            if (newPassword.isEmpty() || newPassword != confirmPassword) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val email = intent.getStringExtra("email")
            resetPassword(email, newPassword)
        }
    }

    private fun resetPassword(email: String?, newPassword: String) {
        // Cập nhật mật khẩu qua Firebase hoặc server API
        //  Thêm logic cập nhật mật khẩu
        Toast.makeText(this, "Password updated successfully", Toast.LENGTH_SHORT).show()
        finish()
    }
}