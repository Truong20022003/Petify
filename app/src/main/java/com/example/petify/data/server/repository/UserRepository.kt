package com.example.petify.data.server.repository

import android.content.Context
import android.util.Log
import android.widget.Toast
import com.example.petify.data.server.enitities.ChangePasswordRequest
import com.example.petify.data.server.enitities.ErrorResponse
import com.example.petify.data.server.enitities.LoginRequest
import com.example.petify.data.server.enitities.LoginResponse
import com.example.petify.data.server.enitities.RegisterResponse
import com.example.petify.data.server.enitities.RegisterUser
import com.example.petify.data.server.enitities.UserModel
import com.example.petify.data.server.service.UserService
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File

class UserRepository(private val api: UserService) {
    suspend fun getListUser(): List<UserModel>? = withContext(Dispatchers.IO) {
        val response = api.getListUser()
        if (response.isSuccessful) {
            Log.d("UserRepository", "getListUser Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRepository", "getListUser Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addUser(User: UserModel): UserModel? = withContext(Dispatchers.IO) {
        val response = api.addUser(User)
        if (response.isSuccessful) {
            Log.d("UserRepository", "addUser Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRepository", "addUser Error: ${response.errorBody()}")
            null
        }
    }

    // xử lý token đăng nhap, luu token de request quen mat khau, theo uid
    suspend fun registerUser(
        name: String,
        email: String,
        password: String,
        phoneNumber: String
    ): RegisterResponse? = withContext(Dispatchers.IO) {
        try {
            val responsePost = RegisterUser(name, email, password, phoneNumber)
            val response = api.register(responsePost)
            Log.d("TAG1234","registerUser Success $response")
            if (response.isSuccessful) {
                response.body()

            } else {
                val errorBody = response.errorBody()?.string() ?: "Unknown error"
                Log.e("UserRepository", "API Error: $errorBody")
                null
            }
        } catch (e: Exception) {
            Log.e("UserRepository", "Exception during API call: ${e.message}")
            null
        }
    }



//    suspend fun loginUser(emailOrPhone: String, password: String): Pair<UserModel?, String?>? =
//        withContext(Dispatchers.IO) {
//            val responsePost = LoginRequest(emailOrPhone, password)
//            val response = api.login(responsePost)
//            if (response.isSuccessful) {
//                Log.d("UserRepository", "loginUser Success: ${response.body().toString()}")
//                val user = response.body()
//                val token = response.headers()["Authorization"] // Lấy token từ header (hoặc body)
//                Pair(user, token)
//            } else {
//                val errorBody = response.errorBody()?.string() // Đọc nội dung lỗi
//                Log.e("UserRepository", "loginUser Error: $errorBody")
//                null
//            }
//        }

    suspend fun loginUser(emailOrPhone: String, password: String): Pair<LoginResponse?, String?>? =
        withContext(Dispatchers.IO) {
            val responsePost = LoginRequest(emailOrPhone, password)
            val response = api.login(responsePost)
            if (response.isSuccessful) {
                Log.d("UserRepository", "loginUser Success: ${response.body()}")
                val user = response.body()
                val token = response.headers()["Authorization"] // Lấy token từ header (hoặc body)
                Pair(user, token)
            } else {
                // Lấy nội dung lỗi từ `errorBody`
                val errorBody = response.errorBody()?.string()
                val loginError = errorBody?.let {
                    try {
                        Gson().fromJson(it, ErrorResponse::class.java)
                    } catch (e: Exception) {
                        Log.e("UserRepository", "Error parsing errorBody", e)
                        null
                    }
                }
                // Ghi log chi tiết lỗi
                Log.e(
                    "UserRepository",
                    "loginUser Error: ${loginError?.status}, ${loginError?.error}"
                )
                null
            }
        }

    suspend fun changePassword(phoneNumber: String, newPassword: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val response = api.changePassword(ChangePasswordRequest(phoneNumber, newPassword))
            if (response.isSuccessful) {
                Log.d("UserRepository", "Password change successful")
                true
            } else {
                Log.e("UserRepository", "Error changing password: ${response.errorBody()?.string()}")
                false
            }
        } catch (e: Exception) {
            Log.e("UserRepository", "Exception while changing password", e)
            false
        }
    }


    suspend fun getUserById(id: String): UserModel? = withContext(Dispatchers.IO) {
        val response = api.getUserById(id)
        if (response.isSuccessful) {
            Log.d("UserRepository", "getUserById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRepository", "getUserById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateUser(id: String, user: UserModel, avataFile: File?): UserModel? = withContext(Dispatchers.IO) {
        val name = user.name.toRequestBody("text/plain".toMediaTypeOrNull())
        val email = user.email.toRequestBody("text/plain".toMediaTypeOrNull())
        val phoneNumber = user.phoneNumber.toRequestBody("text/plain".toMediaTypeOrNull())
        val password = user.password.toRequestBody("text/plain".toMediaTypeOrNull())
        val userName = user.user_name.toRequestBody("text/plain".toMediaTypeOrNull())
        val location = user.location.toRequestBody("text/plain".toMediaTypeOrNull())
        val avataPart = avataFile?.let {
            val requestBody = it.asRequestBody("image/jpeg".toMediaTypeOrNull())
            MultipartBody.Part.createFormData("avata", it.name, requestBody)
        }

        try {
            val response = api.updateUser(id, name, email, phoneNumber, password, userName, location, avataPart)

            if (response.isSuccessful) {
                val result = response.body()?.result
                Log.d("UserRepository", "updateUser Success: $result")
                return@withContext result
            } else {
                val errorMsg = response.errorBody()?.string() ?: "Unknown error"
                Log.e("UserRepository", "updateUser Error: $errorMsg")
                return@withContext null
            }
        } catch (e: Exception) {
            Log.e("UserRepository", "Exception during updateUser", e)
            return@withContext null // Handle exceptions gracefully
        }
    }


    suspend fun deleteUser(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteUser(id)
        if (response.isSuccessful) {
            Log.d("UserRepository", "deleteUser Success")
            true
        } else {
            Log.e("UserRepository", "deleteUser Error: ${response.errorBody()}")
            false
        }
    }
    suspend fun updateUserAddress(id: String, address: String): UserModel? = withContext(Dispatchers.IO) {
        val requestBody = mapOf("location" to address)
        val response = api.updateUserAddress(id, requestBody)
        if (response.isSuccessful) {
            Log.d("UserRepository", "updateUserAddress Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRepository", "updateUserAddress Error: ${response.errorBody()?.string()}")
            null
        }
    }

}