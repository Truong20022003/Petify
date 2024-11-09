package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.ReviewProductModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ReviewProductService {
    @GET("reviewProduct/getListReviewProduct")
    suspend fun getListReviewProduct(): Response<List<ReviewProductModel>>

    @POST("reviewProduct/addreview_product")
    suspend fun addReviewProduct(@Body ReviewProduct: ReviewProductModel): Response<ReviewProductModel>

    @GET("reviewProduct/getreview_productById/{id}")
    suspend fun getReviewProductById(@Path("id") id: String): Response<ReviewProductModel>

    @PUT("reviewProduct/updatereview_product/{id}")
    suspend fun updateReviewProduct(
        @Path("id") id: String,
        @Body ReviewProduct: ReviewProductModel
    ): Response<ReviewProductModel>

    @DELETE("reviewProduct/deletereview_product/{id}")
    suspend fun deleteReviewProduct(@Path("id") id: String): Response<Unit>
}