package com.example.petify.viewmodel

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.UserModel
import com.example.petify.data.server.repository.UserRepository
import com.example.petify.data.server.service.UserRoleService
import com.example.petify.data.server.service.UserService
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.io.IOException

class UserViewModel : BaseViewModel() {
    private val _userList = MutableLiveData<List<UserModel>?>()
    val userList: LiveData<List<UserModel>?> get() = _userList

    private val _user = MutableLiveData<UserModel?>()
    val user: LiveData<UserModel?> get() = _user

    private val _loginSuccess = MutableLiveData<Boolean>()
    val loginSuccess: LiveData<Boolean> get() = _loginSuccess

    private val _isPasswordReset = MutableLiveData<Boolean>()
    val isPasswordReset: LiveData<Boolean> get() = _isPasswordReset

    private val _registrationSuccess = MutableLiveData<Boolean>()
    val registrationSuccess: LiveData<Boolean> get() = _registrationSuccess

    private val _isUserAdded = MutableLiveData<Boolean>()
    val isUserAdded: LiveData<Boolean> get() = _isUserAdded

    private val _isUserUpdated = MutableLiveData<Boolean>()
    val isUserUpdated: LiveData<Boolean> get() = _isUserUpdated

    private val _isUserDeleted = MutableLiveData<Boolean>()
    val isUserDeleted: LiveData<Boolean> get() = _isUserDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListUser() {
        viewModelScope.launch {
            try {

                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                _userList.value = userRepository.getListUser()
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error fetching user list", e)
                _errorMessage.value = "Error fetching user list: ${e.message}"
            }
        }
    }

    fun addUser(user: UserModel) {
        viewModelScope.launch {
            try {

                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                _isUserAdded.value = userRepository.addUser(user) != null
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error adding user", e)
                _errorMessage.value = "Error adding user: ${e.message}"
            }
        }
    }

    fun loginUser(login: String, password: String, context: Context) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                val result = userRepository.loginUser(login, password)
                if (result != null) {
                    val (user, token) = result
                    if (user != null && token != null) {
                        _user.value = user
                        saveToken(token,context) // Lưu token
                        _loginSuccess.value = true
                    } else {
                        _loginSuccess.value = false
                        _errorMessage.value = "Invalid login response"
                    }
                } else {
                    _loginSuccess.value = false
                    _errorMessage.value = "Login failed"
                }
            } catch (e: IOException) {
                _errorMessage.value = "Network error. Please check your connection."
                _loginSuccess.value = false
            } catch (e: HttpException) {
                _errorMessage.value = "Server error: ${e.response()?.errorBody()?.string()}"
                _loginSuccess.value = false
            } catch (e: Exception) {
                _errorMessage.value = "Unexpected error: ${e.message}"
                _loginSuccess.value = false
            }
        }
    }

    private fun saveToken(token: String, context: Context) {
        // Lưu token bằng SharedPreferences hoặc EncryptedSharedPreferences
        val sharedPreferences = context.getSharedPreferences("AppPreferences", Context.MODE_PRIVATE)
        sharedPreferences.edit().putString("auth_token", token).apply()
    }



    fun registerUser(name: String, email: String, password: String) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                val registeredUser = userRepository.registerUser(name, email, password)
                _user.value = registeredUser
                _registrationSuccess.value = registeredUser != null
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error registering user", e)
                _errorMessage.value = "Error registering user: ${e.message}"
                _registrationSuccess.value = false
            }
        }
    }


    fun resetPassword(email: String) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                _isPasswordReset.value = userRepository.resetPassword(email)
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error resetting password", e)
                _errorMessage.value = "Error resetting password: ${e.message}"
            }
        }
    }


    fun getUserById(id: String) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                _user.value = userRepository.getUserById(id)
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error fetching user by ID", e)
                _errorMessage.value = "Error fetching user by ID: ${e.message}"
            }
        }
    }

    fun updateUser(id: String, user: UserModel) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                _isUserUpdated.value = userRepository.updateUser(id, user) != null
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error updating user", e)
                _errorMessage.value = "Error updating user: ${e.message}"
            }
        }
    }

    fun deleteUser(id: String) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                _isUserDeleted.value = userRepository.deleteUser(id)
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error deleting user", e)
                _errorMessage.value = "Error deleting user: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }

}