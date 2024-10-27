package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitity.UserModel
import com.example.petify.data.server.service.UserService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

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

    suspend fun updateUser(id: String, User: UserModel): UserModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateUser(id, User)
        if (response.isSuccessful) {
            Log.d("UserRepository", "updateUser Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRepository", "updateUser Error: ${response.errorBody()}")
            null
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
}