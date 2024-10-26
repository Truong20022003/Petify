package com.example.petify.data.server.service

import com.example.petify.data.server.enitity.NotificationModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface NotificationService {
    @GET("notification/getListNotification")
    suspend fun getListNotification(): Response<List<NotificationModel>>

    @POST("notification/addnotification")
    suspend fun addNotification(@Body Notification: NotificationModel): Response<NotificationModel>

    @GET("notification/getnotificationById/{id}")
    suspend fun getNotificationById(@Path("id") id: String): Response<NotificationModel>

    @PUT("notification/updatenotification/{id}")
    suspend fun updateNotification(
        @Path("id") id: String,
        @Body Notification: NotificationModel
    ): Response<NotificationModel>

    @DELETE("notification/deletenotification/{id}")
    suspend fun deleteNotification(@Path("id") id: String): Response<Unit>
}