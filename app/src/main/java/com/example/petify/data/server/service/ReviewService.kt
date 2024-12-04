package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.ReviewModel
import com.example.petify.data.server.enitities.ReviewModelRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ReviewService {
    @GET("review/getListReview")
    suspend fun getListReview(): Response<List<ReviewModel>>

    @POST("review/addreview")
    suspend fun addReview(@Body Review: ReviewModelRequest): Response<ReviewModel>

    @GET("review/getreviewById/{id}")
    suspend fun getReviewById(@Path("id") id: String): Response<ReviewModel>

    @PUT("review/updatereview/{id}")
    suspend fun updateReview(
        @Path("id") id: String,
        @Body Review: ReviewModel
    ): Response<ReviewModel>

    @DELETE("review/deletereview/{id}")
    suspend fun deleteReview(@Path("id") id: String): Response<Unit>
}