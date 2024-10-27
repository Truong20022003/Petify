package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitity.NotificationModel
import com.example.petify.data.server.service.NotificationService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class NotificationRepository(private val api : NotificationService) {
    suspend fun getListNotification(): List<NotificationModel>? = withContext(Dispatchers.IO) {
        val response = api.getListNotification()
        if (response.isSuccessful) {
            Log.d("NotificationRepository", "getListNotification Success: ${response.body()}")
            response.body()
        } else {
            Log.e("NotificationRepository", "getListNotification Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addNotification(Notification: NotificationModel): NotificationModel? = withContext(Dispatchers.IO) {
        val response = api.addNotification(Notification)
        if (response.isSuccessful) {
            Log.d("NotificationRepository", "addNotification Success: ${response.body()}")
            response.body()
        } else {
            Log.e("NotificationRepository", "addNotification Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getNotificationById(id: String): NotificationModel? = withContext(Dispatchers.IO) {
        val response = api.getNotificationById(id)
        if (response.isSuccessful) {
            Log.d("NotificationRepository", "getNotificationById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("NotificationRepository", "getNotificationById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateNotification(id: String, Notification: NotificationModel): NotificationModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateNotification(id, Notification)
        if (response.isSuccessful) {
            Log.d("NotificationRepository", "updateNotification Success: ${response.body()}")
            response.body()
        } else {
            Log.e("NotificationRepository", "updateNotification Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteNotification(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteNotification(id)
        if (response.isSuccessful) {
            Log.d("NotificationRepository", "deleteNotification Success")
            true
        } else {
            Log.e("NotificationRepository", "deleteNotification Error: ${response.errorBody()}")
            false
        }
    }
}