package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.ReviewModel
import com.example.petify.data.server.enitities.ReviewModelRequest
import com.example.petify.data.server.enitities.ReviewResponse
import com.example.petify.data.server.service.ReviewService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ReviewRepository(private val api: ReviewService) {
    suspend fun getListReview(): List<ReviewModel>? = withContext(Dispatchers.IO) {
        val response = api.getListReview()
        if (response.isSuccessful) {
            Log.d("ReviewRepository", "getListReview Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewRepository", "getListReview Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addReview(Review: ReviewModelRequest): ReviewModel? = withContext(Dispatchers.IO) {
        val response = api.addReview(Review)
        if (response.isSuccessful) {
            Log.d("ReviewRepository", "addReview Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewRepository", "addReview Error: ${response.errorBody()}")
            null
        }
    }
    suspend fun getReviewByProductId(id: String): ReviewResponse? = withContext(Dispatchers.IO) {
        val response = api.getListReviewByProductId(id)
        if (response.isSuccessful) {
            Log.d("ReviewRepository", "getReviewById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewRepository", "getReviewById Error: ${response.errorBody()}")
            null
        }
    }
    suspend fun getReviewById(id: String): ReviewModel? = withContext(Dispatchers.IO) {
        val response = api.getReviewById(id)
        if (response.isSuccessful) {
            Log.d("ReviewRepository", "getReviewById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewRepository", "getReviewById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateReview(id: String, Review: ReviewModel): ReviewModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateReview(id, Review)
        if (response.isSuccessful) {
            Log.d("ReviewRepository", "updateReview Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewRepository", "updateReview Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteReview(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteReview(id)
        if (response.isSuccessful) {
            Log.d("ReviewRepository", "deleteReview Success")
            true
        } else {
            Log.e("ReviewRepository", "deleteReview Error: ${response.errorBody()}")
            false
        }
    }
}