package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.NotificationUserModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface NotificationUserService {
    @GET("notificationUser/getListNotificationUser")
    suspend fun getListNotificationUser(): Response<List<NotificationUserModel>>

    @POST("notificationUser/addnotification_user")
    suspend fun addNotificationUser(@Body NotificationUser: NotificationUserModel): Response<NotificationUserModel>

    @GET("notificationUser/getnotification_userById/{id}")
    suspend fun getNotificationUserById(@Path("id") id: String): Response<NotificationUserModel>

    @PUT("notificationUser/updatenotification_user/{id}")
    suspend fun updateNotificationUser(
        @Path("id") id: String,
        @Body NotificationUser: NotificationUserModel
    ): Response<NotificationUserModel>

    @DELETE("notificationUser/deletenotification_user/{id}")
    suspend fun deleteNotificationUser(@Path("id") id: String): Response<Unit>
}