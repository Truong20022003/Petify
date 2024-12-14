package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.CartRequest
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.data.server.enitities.CartResponseAndStatus
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface CartService {

    @GET("cart/getListCart/{user_id}")
    suspend fun getListCart(@Path("user_id") user_id: String): Response<List<CartResponse>>

    @POST("cart/addToCart")
    suspend fun addCart(@Body cart: CartRequest): Response<CartResponseAndStatus>

    @PUT("cart/update-quantity")
    suspend fun updateCartQuantity(@Body cart: CartRequest): Response<CartRequest>

    @DELETE("cart/delete/{product_id}/{user_id}")
    suspend fun deleteCart(@Path("product_id") product_id: String, @Path("user_id") user_id: String): Response<CartRequest>// này là ko cần data trả ve

 }