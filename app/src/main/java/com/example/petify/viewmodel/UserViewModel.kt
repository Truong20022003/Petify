package com.example.petify.viewmodel

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.LoginResponse
import com.example.petify.data.server.enitities.RegisterResponse
import com.example.petify.data.server.enitities.UserModel
import com.example.petify.data.server.repository.UserRepository
import com.example.petify.data.server.service.UserRoleService
import com.example.petify.data.server.service.UserService
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import retrofit2.HttpException
import java.io.File
import java.io.IOException

class UserViewModel : BaseViewModel() {
    private val _userList = MutableLiveData<List<UserModel>?>()
    val userList: LiveData<List<UserModel>?> get() = _userList

    private val _user = MutableLiveData<UserModel?>()
    val user: LiveData<UserModel?> get() = _user

    private val _userRegisterUser = MutableLiveData<RegisterResponse?>()
    val userRegisterUser: LiveData<RegisterResponse?> get() = _userRegisterUser

    private val _loginSuccess = MutableLiveData<Boolean>()
    val loginSuccess: LiveData<Boolean> get() = _loginSuccess

    private val _loginResponse = MutableLiveData<LoginResponse?>()
    val loginResponse: LiveData<LoginResponse?> get() = _loginResponse

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


    private val _isPasswordChanged = MutableLiveData<Boolean>()
    val isPasswordChanged: LiveData<Boolean> get() = _isPasswordChanged

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
                    val (loginResponse, token) = result
                    _loginResponse.value = loginResponse
                    token?.let { saveToken(it, context) }
                    _loginSuccess.value = true

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
        val sharedPreferences = context.getSharedPreferences("AppPreferences", Context.MODE_PRIVATE)
        sharedPreferences.edit().putString("auth_token", token).apply()
    }



    fun registerUser(name: String, email: String, password: String, phoneNumber : String) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                val registeredUser = userRepository.registerUser(name, email, password, phoneNumber)
                Log.e("UserViewModel", "$registeredUser")

                _userRegisterUser.value = registeredUser
                _registrationSuccess.value = registeredUser != null
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error registering user", e)
                _errorMessage.value = "Error registering user: ${e.message}"
                _registrationSuccess.value = false
            }
        }
    }


    fun changePassword(phoneNumber: String, newPassword: String) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                val isSuccess = userRepository.changePassword(phoneNumber, newPassword)
                if (isSuccess) {
                    _isPasswordChanged.value = true
                } else {
                    _errorMessage.value = "Failed to change password"
                }
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error changing password", e)
                _errorMessage.value = "Error: ${e.message}"
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

    fun updateUser(id: String, user: UserModel, avataFile: File?) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                val updatedUser = userRepository.updateUser(id, user, avataFile)
                _isUserUpdated.value = updatedUser != null
                _user.value = updatedUser
                Log.d("UserViewModel", "User updated successfully: $updatedUser")
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error updating user", e)
                _isUserUpdated.value = false
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
    fun updateUserAddress(id: String, address: String) {
        viewModelScope.launch {
            try {
                val apiService: UserService = CreateInteface.createService()
                val userRepository = UserRepository(apiService)
                val updatedUser = userRepository.updateUserAddress(id, address)
                _isUserUpdated.value = updatedUser != null
                _user.value = updatedUser // Cập nhật thông tin người dùng nếu thành công
            } catch (e: Exception) {
                Log.e("UserViewModel", "Error updating user address", e)
                _errorMessage.value = "Error updating user address: ${e.message}"
                _isUserUpdated.value = false
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }

}