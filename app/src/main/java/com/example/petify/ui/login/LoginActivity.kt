package com.example.petify.ui.login

import android.content.Intent
import android.util.Log
import android.widget.Toast
import com.example.petify.BaseActivity
import com.example.petify.MainActivity
import com.example.petify.R
import com.example.petify.databinding.ActivityLoginBinding
import com.example.petify.ui.signup.SignupActivity
import com.example.petify.viewmodel.UserViewModel

class LoginActivity : BaseActivity<ActivityLoginBinding, UserViewModel>() {
    private var checkPass = false

    override fun createBinding(): ActivityLoginBinding {
        return ActivityLoginBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): UserViewModel {
        return UserViewModel()
    }

    override fun initView() {
        super.initView()
        binding.root.setBackgroundResource(R.drawable.bg_login)

        binding.tvSavePassword.setOnClickListener {
            checkPass = !checkPass
            if (checkPass) {
                binding.tvSavePassword.setCompoundDrawablesRelativeWithIntrinsicBounds(
                    R.drawable.ic_selected_savepassword, 0, 0, 0
                )
            } else {
                binding.tvSavePassword.setCompoundDrawablesRelativeWithIntrinsicBounds(
                    R.drawable.ic_savepassword, 0, 0, 0
                )
            }
        }

        binding.tvSignUp.setOnClickListener {
            val intent = Intent(this, SignupActivity::class.java)
            startActivity(intent)
        }

        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString()
            val password = binding.etPassword.text.toString()
            viewModel.loginUser(email, password)
        }

        observeViewModel()
    }

    private fun observeViewModel() {
        viewModel.loginSuccess.observe(this) { success ->
            if (success) {
                startActivity(Intent(this, MainActivity::class.java))
            } else {
                Log.d("TAG1111", "Login failed")
            }
        }

        viewModel.errorMessage.observe(this) { errorMessage ->
            errorMessage?.let {
                Toast.makeText(this, "Error: $it", Toast.LENGTH_SHORT).show()
                Log.d("TAG1111", "Error: $it")
                viewModel.clearErrorMessage()
            }
        }
    }

}

