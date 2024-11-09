package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.RoleModel
import com.example.petify.data.server.service.RoleService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RoleRepository(private val api: RoleService) {
    suspend fun getListRole(): List<RoleModel>? = withContext(Dispatchers.IO) {
        val response = api.getListRole()
        if (response.isSuccessful) {
            Log.d("RoleRepository", "getListRole Success: ${response.body()}")
            response.body()
        } else {
            Log.e("RoleRepository", "getListRole Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addRole(Role: RoleModel): RoleModel? = withContext(Dispatchers.IO) {
        val response = api.addRole(Role)
        if (response.isSuccessful) {
            Log.d("RoleRepository", "addRole Success: ${response.body()}")
            response.body()
        } else {
            Log.e("RoleRepository", "addRole Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getRoleById(id: String): RoleModel? = withContext(Dispatchers.IO) {
        val response = api.getRoleById(id)
        if (response.isSuccessful) {
            Log.d("RoleRepository", "getRoleById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("RoleRepository", "getRoleById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateRole(id: String, Role: RoleModel): RoleModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateRole(id, Role)
        if (response.isSuccessful) {
            Log.d("RoleRepository", "updateRole Success: ${response.body()}")
            response.body()
        } else {
            Log.e("RoleRepository", "updateRole Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteRole(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteRole(id)
        if (response.isSuccessful) {
            Log.d("RoleRepository", "deleteRole Success")
            true
        } else {
            Log.e("RoleRepository", "deleteRole Error: ${response.errorBody()}")
            false
        }
    }
}