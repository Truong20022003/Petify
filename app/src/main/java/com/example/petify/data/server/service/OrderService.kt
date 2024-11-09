package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.OrderModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface OrderService {
    @GET("order/getListOrder")
    suspend fun getListOrder(): Response<List<OrderModel>>

    @POST("order/addorder")
    suspend fun addOrder(@Body Order: OrderModel): Response<OrderModel>

    @GET("order/getorderById/{id}")
    suspend fun getOrderById(@Path("id") id: String): Response<OrderModel>

    @PUT("order/updateorder/{id}")
    suspend fun updateOrder(
        @Path("id") id: String,
        @Body Order: OrderModel
    ): Response<OrderModel>

    @DELETE("order/deleteorder/{id}")
    suspend fun deleteOrder(@Path("id") id: String): Response<Unit>

}