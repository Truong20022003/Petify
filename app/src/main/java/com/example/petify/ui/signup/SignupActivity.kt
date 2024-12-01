package com.example.petify.ui.signup

import android.content.Intent
import android.widget.Toast
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import com.example.petify.BaseActivity
import com.example.petify.R
import com.example.petify.data.server.enitities.UserRoleRequest
import com.example.petify.databinding.ActivitySignupBinding
import com.example.petify.ui.login.LoginActivity
import com.example.petify.viewmodel.UserRoleViewModel
import com.example.petify.viewmodel.UserViewModel

class SignupActivity : BaseActivity<ActivitySignupBinding, UserViewModel>() {

    private lateinit var userRoleViewModel: UserRoleViewModel

    override fun createBinding(): ActivitySignupBinding {
        return ActivitySignupBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): UserViewModel {
        return ViewModelProvider(this)[UserViewModel::class.java]
    }

    override fun initView() {
        super.initView()
        binding.root.setBackgroundResource(R.drawable.bg_signup)
        userRoleViewModel = ViewModelProvider(this)[UserRoleViewModel::class.java]
        observeUserRole()
        observeRegistrationSuccess()
        binding.btnSignup.setOnClickListener {
            handleSignup()
        }
    }

    private fun observeUserRole() {
        userRoleViewModel.isUserRoleAdded.observe(this) { successAdd ->
            if (successAdd) {
                navigateToLogin()
                Toast.makeText(this, "Đăng ký thành công!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Thêm vai trò người dùng thất bại!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun observeRegistrationSuccess() {
        viewModel.registrationSuccess.observe(this) { success ->
            if (!success) {
                Toast.makeText(this, "Đăng ký thất bại!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun handleSignup() {
        ViewCompat.getWindowInsetsController(binding.root)?.hide(WindowInsetsCompat.Type.ime())
        val name = binding.etName.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()
        val confirmPassword = binding.etRePassword.text.toString().trim()
        val phoneNumber = binding.etNumber.text.toString().trim()
        if (password != confirmPassword) {
            Toast.makeText(this, "Mật khẩu không khớp!", Toast.LENGTH_SHORT).show()
            return
        }
        viewModel.registerUser(name, email, password, phoneNumber)
        viewModel.userRegisterUser.observe(this) { user ->
            user?.result?.id?.let { userId ->
                val userRoleRequest = UserRoleRequest(userId, "672f6ea15367fbd3bf9f69ff")
                userRoleViewModel.addUserRole(userRoleRequest)
            } ?: run {
                Toast.makeText(this, "Không thể lấy thông tin người dùng!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }
}
