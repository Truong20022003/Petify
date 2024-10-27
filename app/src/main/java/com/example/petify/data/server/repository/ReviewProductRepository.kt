package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitity.ReviewProductModel
import com.example.petify.data.server.service.ReviewProductService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ReviewProductRepository(private val api: ReviewProductService) {

    suspend fun getListReviewProduct(): List<ReviewProductModel>? = withContext(Dispatchers.IO) {
        val response = api.getListReviewProduct()
        if (response.isSuccessful) {
            Log.d("ReviewProductRepository", "getListReviewProduct Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewProductRepository", "getListReviewProduct Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addReviewProduct(ReviewProduct: ReviewProductModel): ReviewProductModel? = withContext(Dispatchers.IO) {
        val response = api.addReviewProduct(ReviewProduct)
        if (response.isSuccessful) {
            Log.d("ReviewProductRepository", "addReviewProduct Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewProductRepository", "addReviewProduct Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getReviewProductById(id: String): ReviewProductModel? = withContext(Dispatchers.IO) {
        val response = api.getReviewProductById(id)
        if (response.isSuccessful) {
            Log.d("ReviewProductRepository", "getReviewProductById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewProductRepository", "getReviewProductById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateReviewProduct(id: String, ReviewProduct: ReviewProductModel): ReviewProductModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateReviewProduct(id, ReviewProduct)
        if (response.isSuccessful) {
            Log.d("ReviewProductRepository", "updateReviewProduct Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ReviewProductRepository", "updateReviewProduct Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteReviewProduct(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteReviewProduct(id)
        if (response.isSuccessful) {
            Log.d("ReviewProductRepository", "deleteReviewProduct Success")
            true
        } else {
            Log.e("ReviewProductRepository", "deleteReviewProduct Error: ${response.errorBody()}")
            false
        }
    }
}