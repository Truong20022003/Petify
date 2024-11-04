package com.example.petify.ui.login

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.MainActivity
import com.example.petify.R
import com.example.petify.databinding.ActivityLoginBinding
import com.example.petify.ui.signup.SignupActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class LoginActivity : BaseActivity<ActivityLoginBinding, BaseViewModel>() {
    private var checkPass = false

    override fun createBinding(): ActivityLoginBinding {
        return ActivityLoginBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    override fun initView() {
        super.initView()
        binding.root.setBackgroundResource(R.drawable.bg_login)

        binding.tvSavePassword.setOnClickListener {
            checkPass = !checkPass
            if (checkPass) {
                binding.tvSavePassword.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.ic_selected_savepassword, 0, 0, 0)
            } else {
                binding.tvSavePassword.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.ic_savepassword, 0, 0, 0)
            }
        }

        binding.tvSignUp.setOnClickListener {
            val intent = Intent(this, SignupActivity::class.java)
            startActivity(intent)
        }

        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString()
            val password = binding.etPassword.text.toString()
            loginUser(email, password)
        }
    }

    private fun loginUser(email: String, password: String) {
        val jsonObject = JSONObject()
        jsonObject.put("email", email)
        jsonObject.put("password", password)

        val client = OkHttpClient()
        val requestBody: RequestBody = jsonObject.toString().toRequestBody("application/json".toMediaTypeOrNull())

        val request = Request.Builder()
            .url("http://192.168.0.104:3000/user/login")
            .post(requestBody)
            .build()

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = client.newCall(request).execute()
                if (response.isSuccessful) {
                    val responseData = response.body?.string()
                    launch(Dispatchers.Main) {
                        Toast.makeText(this@LoginActivity, "Login successful", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                    }
                } else {
                    launch(Dispatchers.Main) {
                        Toast.makeText(this@LoginActivity, "Login failed", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                launch(Dispatchers.Main) {
                    Toast.makeText(this@LoginActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
