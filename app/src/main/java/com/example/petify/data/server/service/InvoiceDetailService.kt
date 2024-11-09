package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.InvoiceDetailModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface InvoiceDetailService {
    @GET("invoiceDetail/getListInvoiceDetail")
    suspend fun getListInvoiceDetail(): Response<List<InvoiceDetailModel>>

    @POST("invoiceDetail/addinvoice_detail")
    suspend fun addInvoiceDetail(@Body InvoiceDetail: InvoiceDetailModel): Response<InvoiceDetailModel>

    @GET("invoiceDetail/getinvoice_detailById/{id}")
    suspend fun getInvoiceDetailById(@Path("id") id: String): Response<InvoiceDetailModel>

    @PUT("invoiceDetail/updateinvoice_detail/{id}")
    suspend fun updateInvoiceDetail(
        @Path("id") id: String,
        @Body InvoiceDetail: InvoiceDetailModel
    ): Response<InvoiceDetailModel>

    @DELETE("invoiceDetail/deleteinvoice_detail/{id}")
    suspend fun deleteInvoiceDetail(@Path("id") id: String): Response<Unit>
}