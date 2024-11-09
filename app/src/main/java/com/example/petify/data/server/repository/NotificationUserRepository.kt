package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.NotificationUserModel
import com.example.petify.data.server.service.NotificationUserService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class NotificationUserRepository(private val api : NotificationUserService) {
    suspend fun getListNotificationUser(): List<NotificationUserModel>? = withContext(Dispatchers.IO) {
        val response = api.getListNotificationUser()
        if (response.isSuccessful) {
            Log.d("NotificationUserRepository", "getListNotificationUser Success: ${response.body()}")
            response.body()
        } else {
            Log.e("NotificationUserRepository", "getListNotificationUser Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addNotificationUser(NotificationUser: NotificationUserModel): NotificationUserModel? = withContext(Dispatchers.IO) {
        val response = api.addNotificationUser(NotificationUser)
        if (response.isSuccessful) {
            Log.d("NotificationUserRepository", "addNotificationUser Success: ${response.body()}")
            response.body()
        } else {
            Log.e("NotificationUserRepository", "addNotificationUser Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getNotificationUserById(id: String): NotificationUserModel? = withContext(Dispatchers.IO) {
        val response = api.getNotificationUserById(id)
        if (response.isSuccessful) {
            Log.d("NotificationUserRepository", "getNotificationUserById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("NotificationUserRepository", "getNotificationUserById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateNotificationUser(id: String, NotificationUser: NotificationUserModel): NotificationUserModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateNotificationUser(id, NotificationUser)
        if (response.isSuccessful) {
            Log.d("NotificationUserRepository", "updateNotificationUser Success: ${response.body()}")
            response.body()
        } else {
            Log.e("NotificationUserRepository", "updateNotificationUser Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteNotificationUser(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteNotificationUser(id)
        if (response.isSuccessful) {
            Log.d("NotificationUserRepository", "deleteNotificationUser Success")
            true
        } else {
            Log.e("NotificationUserRepository", "deleteNotificationUser Error: ${response.errorBody()}")
            false
        }
    }
}