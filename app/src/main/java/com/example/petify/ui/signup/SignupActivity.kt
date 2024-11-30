package com.example.petify.ui.signup

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.Observer
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivitySignupBinding
import com.example.petify.ui.login.LoginActivity
import com.example.petify.viewmodel.UserViewModel

class SignupActivity : BaseActivity<ActivitySignupBinding,UserViewModel>() {
    override fun createBinding(): ActivitySignupBinding {
        return ActivitySignupBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): UserViewModel {
      return UserViewModel()
    }

    override fun initView() {
        super.initView()
        binding.root.setBackgroundResource(R.drawable.bg_signup)

        viewModel.registrationSuccess.observe(this, Observer { success ->
            if (success) {
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
                Toast.makeText(this, "Registration successful!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Registration failed. Please try again.", Toast.LENGTH_SHORT).show()
            }
        })

        binding.btnSignup.setOnClickListener {
            val name = binding.etName.text.toString().trim()
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            val confirmPassword = binding.etRePassword.text.toString().trim()
            val phoneNumber = binding.etNumber.text.toString().trim()
            if (password == confirmPassword) {
                viewModel.registerUser(name, email, password,phoneNumber)
            } else {
                Toast.makeText(this, "Passwords do not match!", Toast.LENGTH_SHORT).show()
            }
        }
    }


}