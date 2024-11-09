package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.ReviewModel
import com.example.petify.data.server.repository.ReviewRepository
import kotlinx.coroutines.launch

class ReviewViewModel : BaseViewModel() {
    private val _reviewList = MutableLiveData<List<ReviewModel>?>()
    val reviewList: LiveData<List<ReviewModel>?> get() = _reviewList

    private val _review = MutableLiveData<ReviewModel?>()
    val review: LiveData<ReviewModel?> get() = _review

    private val _isReviewAdded = MutableLiveData<Boolean>()
    val isReviewAdded: LiveData<Boolean> get() = _isReviewAdded

    private val _isReviewUpdated = MutableLiveData<Boolean>()
    val isReviewUpdated: LiveData<Boolean> get() = _isReviewUpdated

    private val _isReviewDeleted = MutableLiveData<Boolean>()
    val isReviewDeleted: LiveData<Boolean> get() = _isReviewDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListReview() {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReview()
                val reviewRepository = ReviewRepository(apiService)
                _reviewList.value = reviewRepository.getListReview()
            } catch (e: Exception) {
                Log.e("ReviewViewModel", "Error fetching review list", e)
                _errorMessage.value = "Error fetching review list: ${e.message}"
            }
        }
    }

    fun addReview(review: ReviewModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReview()
                val reviewRepository = ReviewRepository(apiService)
                _isReviewAdded.value = reviewRepository.addReview(review) != null
            } catch (e: Exception) {
                Log.e("ReviewViewModel", "Error adding review", e)
                _errorMessage.value = "Error adding review: ${e.message}"
            }
        }
    }

    fun getReviewById(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReview()
                val reviewRepository = ReviewRepository(apiService)
                _review.value = reviewRepository.getReviewById(id)
            } catch (e: Exception) {
                Log.e("ReviewViewModel", "Error fetching review by ID", e)
                _errorMessage.value = "Error fetching review by ID: ${e.message}"
            }
        }
    }

    fun updateReview(id: String, review: ReviewModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReview()
                val reviewRepository = ReviewRepository(apiService)
                _isReviewUpdated.value = reviewRepository.updateReview(id, review) != null
            } catch (e: Exception) {
                Log.e("ReviewViewModel", "Error updating review", e)
                _errorMessage.value = "Error updating review: ${e.message}"
            }
        }
    }

    fun deleteReview(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReview()
                val reviewRepository = ReviewRepository(apiService)
                _isReviewDeleted.value = reviewRepository.deleteReview(id)
            } catch (e: Exception) {
                Log.e("ReviewViewModel", "Error deleting review", e)
                _errorMessage.value = "Error deleting review: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}