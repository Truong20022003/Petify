package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.data.server.enitities.ProductModelSaleNew
import com.example.petify.data.server.enitities.UpdateQuantity
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

    @GET("product/getLatestSaleUpdatedProduct")
    suspend fun getLatestSaleUpdatedProduct(): Response<ProductModelSaleNew>

    @POST("product/addproduct")
    suspend fun addProduct(@Body product: ProductModel): Response<ProductModel>

    @GET("product/getproductById/{id}")
    suspend fun getProductById(@Path("id") id: String): Response<ProductModel>

    @PUT("product/updateproduct/{id}")
    suspend fun updateProduct(
        @Path("id") id: String,
        @Body product: ProductModel
    ): Response<ProductModel>

    @PUT("product/reduceProductQuantity/{id}")
    suspend fun updateQuantity(
        @Path("id") id: String,
        @Body product: UpdateQuantity
    ): Response<ProductModelSaleNew>

    @DELETE("product/deleteproduct/{id}")
    suspend fun deleteProduct(@Path("id") id: String): Response<Unit>
}