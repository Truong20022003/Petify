package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitity.ReviewProductModel
import com.example.petify.data.server.repository.ReviewProductRepository
import kotlinx.coroutines.launch

class ReviewProductViewModel : BaseViewModel() {
    private val _reviewProductList = MutableLiveData<List<ReviewProductModel>?>()
    val reviewProductList: LiveData<List<ReviewProductModel>?> get() = _reviewProductList

    private val _reviewProduct = MutableLiveData<ReviewProductModel?>()
    val reviewProduct: LiveData<ReviewProductModel?> get() = _reviewProduct

    private val _isReviewProductAdded = MutableLiveData<Boolean>()
    val isReviewProductAdded: LiveData<Boolean> get() = _isReviewProductAdded

    private val _isReviewProductUpdated = MutableLiveData<Boolean>()
    val isReviewProductUpdated: LiveData<Boolean> get() = _isReviewProductUpdated

    private val _isReviewProductDeleted = MutableLiveData<Boolean>()
    val isReviewProductDeleted: LiveData<Boolean> get() = _isReviewProductDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListReviewProduct() {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReviewProduct()
                val reviewProductRepository = ReviewProductRepository(apiService)
                _reviewProductList.value = reviewProductRepository.getListReviewProduct()
            } catch (e: Exception) {
                Log.e("ReviewProductViewModel", "Error fetching review product list", e)
                _errorMessage.value = "Error fetching review product list: ${e.message}"
            }
        }
    }

    fun addReviewProduct(reviewProduct: ReviewProductModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReviewProduct()
                val reviewProductRepository = ReviewProductRepository(apiService)
                _isReviewProductAdded.value =
                    reviewProductRepository.addReviewProduct(reviewProduct) != null
            } catch (e: Exception) {
                Log.e("ReviewProductViewModel", "Error adding review product", e)
                _errorMessage.value = "Error adding review product: ${e.message}"
            }
        }
    }

    fun getReviewProductById(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReviewProduct()
                val reviewProductRepository = ReviewProductRepository(apiService)
                _reviewProduct.value = reviewProductRepository.getReviewProductById(id)
            } catch (e: Exception) {
                Log.e("ReviewProductViewModel", "Error fetching review product by ID", e)
                _errorMessage.value = "Error fetching review product by ID: ${e.message}"
            }
        }
    }

    fun updateReviewProduct(id: String, reviewProduct: ReviewProductModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReviewProduct()
                val reviewProductRepository = ReviewProductRepository(apiService)
                _isReviewProductUpdated.value =
                    reviewProductRepository.updateReviewProduct(id, reviewProduct) != null
            } catch (e: Exception) {
                Log.e("ReviewProductViewModel", "Error updating review product", e)
                _errorMessage.value = "Error updating review product: ${e.message}"
            }
        }
    }

    fun deleteReviewProduct(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createReviewProduct()
                val reviewProductRepository = ReviewProductRepository(apiService)
                _isReviewProductDeleted.value = reviewProductRepository.deleteReviewProduct(id)
            } catch (e: Exception) {
                Log.e("ReviewProductViewModel", "Error deleting review product", e)
                _errorMessage.value = "Error deleting review product: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}