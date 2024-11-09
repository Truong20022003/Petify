package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.SupplierModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface SupplierService {
    @GET("supplier/getListSupplier")
    suspend fun getListSupplier(): Response<List<SupplierModel>>

    @POST("supplier/addsupplier")
    suspend fun addSupplier(@Body Supplier: SupplierModel): Response<SupplierModel>

    @GET("supplier/getsupplierById/{id}")
    suspend fun getSupplierById(@Path("id") id: String): Response<SupplierModel>

    @PUT("supplier/updatesupplier/{id}")
    suspend fun updateSupplier(
        @Path("id") id: String,
        @Body Supplier: SupplierModel
    ): Response<SupplierModel>

    @DELETE("supplier/deletesupplier/{id}")
    suspend fun deleteSupplier(@Path("id") id: String): Response<Unit>
}