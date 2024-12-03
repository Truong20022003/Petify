package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.UpdateResponse
import com.example.petify.data.server.enitities.ChangePasswordRequest
import com.example.petify.data.server.enitities.LoginRequest
import com.example.petify.data.server.enitities.LoginResponse
import com.example.petify.data.server.enitities.RegisterResponse
import com.example.petify.data.server.enitities.RegisterUser
import com.example.petify.data.server.enitities.UserModel
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Part
import retrofit2.http.Path

interface UserService {
    @GET("user/getListUser")
    suspend fun getListUser(): Response<List<UserModel>>

    @POST("user/adduser")
    suspend fun addUser(@Body user: UserModel): Response<UserModel>

    @POST("user/login")
    suspend fun login(@Body user: LoginRequest): Response<LoginResponse>

    @POST("user/register")
    suspend fun register(@Body user: RegisterUser): Response<RegisterResponse>

    @GET("user/getuserById/{id}")
    suspend fun getUserById(@Path("id") id: String): Response<UserModel>

    //    @PUT("user/updateuser/{id}")
//    suspend fun updateUser(
//        @Path("id") id: String,
//        @Body User: UserModel
//    ): Response<UserModel>
    @Multipart
    @PUT("user/updateuser/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Part("name") name: RequestBody,
        @Part("email") email: RequestBody,
        @Part("phone_number") phoneNumber: RequestBody,
        @Part("password") password: RequestBody,
        @Part("user_name") userName: RequestBody,
        @Part("location") location: RequestBody,
        @Part avata: MultipartBody.Part?
    ): Response<UpdateResponse>


    @DELETE("user/deleteuser/{id}")
    suspend fun deleteUser(@Path("id") id: String): Response<Unit>

    @POST("user/reset-password")
    suspend fun changePassword(@Body requestBody: ChangePasswordRequest): Response<Unit>

    @PATCH("user/update-address/{id}")
    suspend fun updateUserAddress(
        @Path("id") id: String,
        @Body location: Map<String, String>
    ): Response<UserModel>

}