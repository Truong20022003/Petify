package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.UserRoleModel
import com.example.petify.data.server.enitities.UserRoleRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface UserRoleService {
    @GET("userRole/getListUserRole")
    suspend fun getListUserRole(): Response<List<UserRoleModel>>

    @POST("userRole/adduser_role")
    suspend fun addUserRole(@Body UserRole: UserRoleRequest): Response<UserRoleModel>

    @GET("userRole/getuser_roleById/{id}")
    suspend fun getUserRoleById(@Path("id") id: String): Response<UserRoleModel>

    @PUT("userRole/updateuser_role/{id}")
    suspend fun updateUserRole(
        @Path("id") id: String,
        @Body UserRole: UserRoleModel
    ): Response<UserRoleModel>

    @DELETE("userRole/deleteuser_role/{id}")
    suspend fun deleteUserRole(@Path("id") id: String): Response<Unit>
}