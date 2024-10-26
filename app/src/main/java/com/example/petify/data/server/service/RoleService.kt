package com.example.petify.data.server.service

import com.example.petify.data.server.enitity.RoleModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface RoleService {
    @GET("role/getListRole")
    suspend fun getListRole(): Response<List<RoleModel>>

    @POST("role/addrole")
    suspend fun addRole(@Body Role: RoleModel): Response<RoleModel>

    @GET("role/getroleById/{id}")
    suspend fun getRoleById(@Path("id") id: String): Response<RoleModel>

    @PUT("role/updaterole/{id}")
    suspend fun updateRole(
        @Path("id") id: String,
        @Body Role: RoleModel
    ): Response<RoleModel>

    @DELETE("role/deleterole/{id}")
    suspend fun deleteRole(@Path("id") id: String): Response<Unit>
}