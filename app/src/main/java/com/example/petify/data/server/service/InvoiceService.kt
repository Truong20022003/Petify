package com.example.petify.data.server.service

import com.example.petify.data.server.enitity.InvoiceModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface InvoiceService {
    @GET("invoice/getListInvoice")
    suspend fun getListInvoice(): Response<List<InvoiceModel>>

    @POST("invoice/addinvoice")
    suspend fun addInvoice(@Body Invoice: InvoiceModel): Response<InvoiceModel>

    @GET("invoice/getinvoiceById/{id}")
    suspend fun getInvoiceById(@Path("id") id: String): Response<InvoiceModel>

    @PUT("invoice/updateinvoice/{id}")
    suspend fun updateInvoice(
        @Path("id") id: String,
        @Body Invoice: InvoiceModel
    ): Response<InvoiceModel>

    @DELETE("invoice/deleteinvoice/{id}")
    suspend fun deleteInvoice(@Path("id") id: String): Response<Unit>
}