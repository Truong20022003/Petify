package com.example.petify.ui.signup

import android.content.Intent
import android.text.Editable
import android.text.TextWatcher
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
        validation()
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
//                Toast.makeText(this, "Thêm vai trò người dùng thất bại!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun observeRegistrationSuccess() {
        viewModel.registrationSuccess.observe(this) { success ->
            if (!success) {
                Toast.makeText(this, "Số điện thoại hoặc email đã được sử dụng", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun validation() {
        binding.etName.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val input = s.toString()
                if (!validateName(input)) {
                    binding.tilName.error = "Tên phải có ít nhất 3 ký tự"
                } else {
                    binding.tilName.error = null
                }
            }

            override fun afterTextChanged(s: Editable?) {

            }
        })

        binding.etEmail.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val input = s.toString()

                if (!validateEmail(input)) {
                    binding.tilEmail.error = "Email không hợp lệ"
                } else {
                    binding.tilEmail.error = null
                }
            }

            override fun afterTextChanged(s: Editable?) {

            }
        })
        binding.etPassword.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val input = s.toString()

                if (!validatePassword(input)) {
                    binding.tilPassword.error = "Mật khẩu phải có ít nhất 6 ký tự"
                } else {
                    binding.tilPassword.error = null
                }
            }

            override fun afterTextChanged(s: Editable?) {

            }
        })
        binding.etRePassword.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val input = s.toString()
                if (!validateConfirmPassword(binding.etPassword.text.toString(), input)) {
                    binding.tilRePassword.error = "Mật khẩu xác nhận không khớp"
                } else {
                    binding.tilRePassword.error = null
                }
            }

            override fun afterTextChanged(s: Editable?) {

            }
        })
        binding.etNumber.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val phoneNumberInput = s.toString().trim()
                val phoneNumber = if (phoneNumberInput.startsWith("0")) {
                    "+84" + phoneNumberInput.substring(1)
                } else {
                    phoneNumberInput
                }
                if (!validatePhoneNumber(phoneNumber)) {
                    binding.tilPhoneNumber.error = "Số điện thoại không hợp lệ"
                } else {
                    binding.tilPhoneNumber.error = null
                }

            }

            override fun afterTextChanged(s: Editable?) {

            }
        })

    }

    private fun handleSignup() {
        ViewCompat.getWindowInsetsController(binding.root)?.hide(WindowInsetsCompat.Type.ime())
        val name = binding.etName.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()
        val confirmPassword = binding.etRePassword.text.toString().trim()
        val phoneNumberInput = binding.etNumber.text.toString().trim()
        val phoneNumber = if (phoneNumberInput.startsWith("0")) {
            "+84" + phoneNumberInput.substring(1)
        } else {
            phoneNumberInput
        }
        if (!validateName(name)) {
            binding.tilName.error = "Tên phải có ít nhất 3 ký tự"
            return
        } else {
            binding.tilName.error = null
        }

        if (!validateEmail(email)) {
            binding.tilEmail.error = "Email không hợp lệ"
            return
        } else {
            binding.tilEmail.error = null
        }

        if (!validatePassword(password)) {
            binding.tilPassword.error = "Mật khẩu phải có ít nhất 6 ký tự"
            return
        } else {
            binding.tilPassword.error = null
        }

        if (!validateConfirmPassword(password, confirmPassword)) {
            binding.tilRePassword.error = "Mật khẩu xác nhận không khớp"
            return
        } else {
            binding.tilRePassword.error = null
        }

        if (!validatePhoneNumber(phoneNumber)) {
            binding.tilPhoneNumber.error = "Số điện thoại không hợp lệ"
            return
        } else {
            binding.tilPhoneNumber.error = null
        }
        // Nếu tất cả các trường hợp lệ, tiến hành đăng ký
        viewModel.registerUser(name, email, password, phoneNumber)
        viewModel.userRegisterUser.observe(this) { user ->
            user?.result?.id?.let { userId ->
                val userRoleRequest = UserRoleRequest(userId, "672f6ea15367fbd3bf9f69ff")
                userRoleViewModel.addUserRole(userRoleRequest)
            } ?: run {
                Toast.makeText(
                    this,
                    "Số điện thoại hoặc email đã được sử dụng",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }


    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }


    private fun validateName(name: String): Boolean {
        return name.isNotEmpty() && name.length >= 3
    }

    private fun validateEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    private fun validatePassword(password: String): Boolean {
        return password.length >= 6
    }

    private fun validateConfirmPassword(password: String, confirmPassword: String): Boolean {
        return password == confirmPassword
    }

    private fun validatePhoneNumber(phoneNumber: String): Boolean {
        return phoneNumber.matches(Regex("^\\+?[0-9]{10,13}$"))
    }

}
