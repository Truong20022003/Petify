package com.example.petify.data.server.service

import com.example.petify.data.server.enitity.UserModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface UserService {
    @GET("user/getListUser")
    suspend fun getListUser(): Response<List<UserModel>>

    @POST("user/adduser")
    suspend fun addUser(@Body user: UserModel): Response<UserModel>

    @POST("user/login")
    suspend fun login(@Body email: String, password: String): Response<UserModel>

    @POST("user/register")
    suspend fun register(@Body email: String, password: String): Response<UserModel>

    @GET("user/getuserById/{id}")
    suspend fun getUserById(@Path("id") id: String): Response<UserModel>

    @PUT("user/updateuser/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body User: UserModel
    ): Response<UserModel>

    @DELETE("user/deleteuser/{id}")
    suspend fun deleteUser(@Path("id") id: String): Response<Unit>
}