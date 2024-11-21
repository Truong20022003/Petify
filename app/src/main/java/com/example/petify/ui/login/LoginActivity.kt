package com.example.petify.ui.login

import android.content.Intent
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import com.example.petify.BaseActivity
import com.example.petify.MainActivity
import com.example.petify.R
import com.example.petify.databinding.ActivityLoginBinding
import com.example.petify.ui.forgotpassword.ForgotPasswordActivity
import com.example.petify.ui.signup.SignupActivity
import com.example.petify.view.tap
import com.example.petify.viewmodel.UserViewModel
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider

class LoginActivity : BaseActivity<ActivityLoginBinding, UserViewModel>() {
    private var checkPass = false
    private lateinit var googleSignInClient: GoogleSignInClient
    private lateinit var firebaseAuth: FirebaseAuth
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
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id)) // Thay bằng client_id của bạn
            .requestEmail()
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)
        firebaseAuth = FirebaseAuth.getInstance()
        binding.llLoginGoogle.setOnClickListener {
            signInWithGoogle()
        }
        binding.tvSignUp.setOnClickListener {
            val intent = Intent(this, SignupActivity::class.java)
            startActivity(intent)
        }
binding.tvForgotPassword.tap {
    val intent = Intent(this, ForgotPasswordActivity::class.java)
    startActivity(intent)
}
        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString()
            val password = binding.etPassword.text.toString()
            viewModel.loginUser(email, password,this@LoginActivity)
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
    private val googleSignInLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            if (task.isSuccessful) {
                val account = task.result
                firebaseAuthWithGoogle(account)
            } else {
                Log.e("FirebaseAuth", "Auth failed: ${task.exception?.message}")
                Toast.makeText(this, "Google Sign-In failed.", Toast.LENGTH_SHORT).show()
            }
        }

    private fun signInWithGoogle() {
        val signInIntent = googleSignInClient.signInIntent
        googleSignInLauncher.launch(signInIntent)
    }

    private fun firebaseAuthWithGoogle(account: GoogleSignInAccount?) {
        val credential = GoogleAuthProvider.getCredential(account?.idToken, null)
        firebaseAuth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    val user = firebaseAuth.currentUser
                    sendUserDataToServer(user?.displayName, user?.email)
                } else {
                    val exception = task.exception
                    Log.e("GoogleSignIn", "Sign-in failed: ${exception?.message}")
                    Toast.makeText(this, "Authentication Failed.", Toast.LENGTH_SHORT).show()
                }
            }
    }

    private fun sendUserDataToServer(name: String?, email: String?) {
        // Gửi thông tin người dùng lên server qua API
      if (name.isNullOrBlank() && email.isNullOrBlank()){

      }else{
          viewModel.loginUser(name!!, email!!,this@LoginActivity)
          Toast.makeText(this, "Welcome $name!", Toast.LENGTH_SHORT).show()
          startActivity(Intent(this, MainActivity::class.java))
      }

    }

}

