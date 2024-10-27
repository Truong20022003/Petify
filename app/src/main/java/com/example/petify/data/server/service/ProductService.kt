package com.example.petify.data.server.service

import com.example.petify.data.server.enitity.ProductModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ProductService {
    @GET("product/getListProduct")
    suspend fun getListProduct(): Response<List<ProductModel>>

    @POST("product/addproduct")
    suspend fun addProduct(@Body product: ProductModel): Response<ProductModel>

    @GET("product/getproductById/{id}")
    suspend fun getProductById(@Path("id") id: String): Response<ProductModel>

    @PUT("product/updateproduct/{id}")
    suspend fun updateProduct(
        @Path("id") id: String,
        @Body product: ProductModel
    ): Response<ProductModel>

    @DELETE("product/deleteproduct/{id}")
    suspend fun deleteProduct(@Path("id") id: String): Response<Unit>
}