package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.InvoiceDetailAndProductModel
import com.example.petify.data.server.enitities.InvoiceDetailModel
import com.example.petify.data.server.enitities.InvoiceDetailModelRequest
import com.example.petify.data.server.enitities.OrderResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface InvoiceDetailService {
    @GET("order_detail/getListorderDetail")
    suspend fun getListInvoiceDetail(): Response<List<InvoiceDetailModel>>

    @POST("order_detail/addorder_detail")
    suspend fun addInvoiceDetail(@Body InvoiceDetail: InvoiceDetailModelRequest): Response<InvoiceDetailModel>

    @GET("order_detail/getAllOrderDetailsWithStatus/{user_id}")
    suspend fun getAllOrderDetailsWithStatus(@Path("user_id") user_id: String): Response<List<OrderResponse>>

    @GET("invoiceDetail/getinvoice_detailByIdUser/{user_id}")
    suspend fun getinvoicedetailByIdUser(@Path("user_id") user_id: String): Response<List<InvoiceDetailAndProductModel>>

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