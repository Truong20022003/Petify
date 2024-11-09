package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.UserRoleModel
import com.example.petify.data.server.service.UserRoleService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserRoleRepository(private val api: UserRoleService) {

    suspend fun getListUserRole(): List<UserRoleModel>? = withContext(Dispatchers.IO) {
        val response = api.getListUserRole()
        if (response.isSuccessful) {
            Log.d("UserRoleRepository", "getListUserRole Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRoleRepository", "getListUserRole Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addUserRole(UserRole: UserRoleModel): UserRoleModel? = withContext(Dispatchers.IO) {
        val response = api.addUserRole(UserRole)
        if (response.isSuccessful) {
            Log.d("UserRoleRepository", "addUserRole Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRoleRepository", "addUserRole Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getUserRoleById(id: String): UserRoleModel? = withContext(Dispatchers.IO) {
        val response = api.getUserRoleById(id)
        if (response.isSuccessful) {
            Log.d("UserRoleRepository", "getUserRoleById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRoleRepository", "getUserRoleById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateUserRole(id: String, UserRole: UserRoleModel): UserRoleModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateUserRole(id, UserRole)
        if (response.isSuccessful) {
            Log.d("UserRoleRepository", "updateUserRole Success: ${response.body()}")
            response.body()
        } else {
            Log.e("UserRoleRepository", "updateUserRole Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteUserRole(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteUserRole(id)
        if (response.isSuccessful) {
            Log.d("UserRoleRepository", "deleteUserRole Success")
            true
        } else {
            Log.e("UserRoleRepository", "deleteUserRole Error: ${response.errorBody()}")
            false
        }
    }
}