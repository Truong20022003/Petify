package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.LoginRequest
import com.example.petify.data.server.enitities.LoginResponse
import com.example.petify.data.server.enitities.RegisterUser
import com.example.petify.data.server.enitities.UserModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface UserService {
    @GET("user/getListUser")
    suspend fun getListUser(): Response<List<UserModel>>

    @POST("user/adduser")
    suspend fun addUser(@Body user: UserModel): Response<UserModel>

    @POST("user/login")
    suspend fun login(@Body user : LoginRequest): Response<LoginResponse>

    @POST("user/register")
    suspend fun register(@Body user : RegisterUser): Response<UserModel>

    @GET("user/getuserById/{id}")
    suspend fun getUserById(@Path("id") id: String): Response<UserModel>

    @PUT("user/updateuser/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body User: UserModel
    ): Response<UserModel>

    @DELETE("user/deleteuser/{id}")
    suspend fun deleteUser(@Path("id") id: String): Response<Unit>

    @POST("user/reset-password")
    suspend fun resetPassword(@Body email: String): Response<Unit>

    @PATCH("user/update-address/{id}")
    suspend fun updateUserAddress(
        @Path("id") id: String,
        @Body location: Map<String, String>
    ): Response<UserModel>

}