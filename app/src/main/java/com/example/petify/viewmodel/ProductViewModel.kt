package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.data.server.repository.ProductRepository
import com.example.petify.data.server.service.ProductCategoryService
import com.example.petify.data.server.service.ProductService
import kotlinx.coroutines.launch

class ProductViewModel : BaseViewModel() {
    private val _productList = MutableLiveData<List<ProductModel>?>()
    val productList: LiveData<List<ProductModel>?> get() = _productList

    private val _product = MutableLiveData<ProductModel?>()
    val product: LiveData<ProductModel?> get() = _product

    private val _isProductAdded = MutableLiveData<Boolean>()
    val isProductAdded: LiveData<Boolean> get() = _isProductAdded

    private val _isProductUpdated = MutableLiveData<Boolean>()
    val isProductUpdated: LiveData<Boolean> get() = _isProductUpdated

    private val _isProductDeleted = MutableLiveData<Boolean>()
    val isProductDeleted: LiveData<Boolean> get() = _isProductDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListProduct() {
        viewModelScope.launch {
            try {
                val apiService: ProductService = CreateInteface.createService()
                val productRepository = ProductRepository(apiService)
                _productList.value = productRepository.getListProduct()
            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error fetching product list", e)
                _errorMessage.value = "Error fetching product list: ${e.message}"
            }
        }
    }

    fun addProduct(product: ProductModel) {
        viewModelScope.launch {
            try {
                val apiService: ProductService = CreateInteface.createService()
                val productRepository = ProductRepository(apiService)
                _isProductAdded.value = productRepository.addProduct(product) != null
            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error adding product", e)
                _errorMessage.value = "Error adding product: ${e.message}"
            }
        }
    }

    fun getProductById(id: String) {
        viewModelScope.launch {
            try {
                val apiService: ProductService = CreateInteface.createService()
                val productRepository = ProductRepository(apiService)
                _product.value = productRepository.getProductById(id)
            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error fetching product by ID", e)
                _errorMessage.value = "Error fetching product by ID: ${e.message}"
            }
        }
    }

    fun updateProduct(id: String, product: ProductModel) {
        viewModelScope.launch {
            try {
                val apiService: ProductService = CreateInteface.createService()
                val productRepository = ProductRepository(apiService)
                _isProductUpdated.value = productRepository.updateProduct(id, product) != null
            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error updating product", e)
                _errorMessage.value = "Error updating product: ${e.message}"
            }
        }
    }

    fun deleteProduct(id: String) {
        viewModelScope.launch {
            try {
                val apiService: ProductService = CreateInteface.createService()
                val productRepository = ProductRepository(apiService)
                _isProductDeleted.value = productRepository.deleteProduct(id)
            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error deleting product", e)
                _errorMessage.value = "Error deleting product: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}