package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.CategoryWithProductsModel
import com.example.petify.data.server.enitities.ProductCategoryModel
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.data.server.repository.ProductCategoryRepository
import com.example.petify.data.server.service.OrderService
import com.example.petify.data.server.service.ProductCategoryService
import kotlinx.coroutines.launch

class ProductCategoryViewModel : BaseViewModel() {
    private val _productCategoryList = MutableLiveData<List<ProductCategoryModel>?>()
    val productCategoryList: LiveData<List<ProductCategoryModel>?> get() = _productCategoryList

    private val _product = MutableLiveData<List<ProductModel>?>()
    val product : LiveData<List<ProductModel>?> get() = _product

    private val _responseProductCategoryList = MutableLiveData<List<CategoryWithProductsModel>?>()
    val responseProductCategoryList: LiveData<List<CategoryWithProductsModel>?> get() = _responseProductCategoryList

    private val _productCategory = MutableLiveData<ProductCategoryModel?>()
    val productCategory: LiveData<ProductCategoryModel?> get() = _productCategory

    private val _isProductCategoryAdded = MutableLiveData<Boolean>()
    val isProductCategoryAdded: LiveData<Boolean> get() = _isProductCategoryAdded

    private val _isProductCategoryUpdated = MutableLiveData<Boolean>()
    val isProductCategoryUpdated: LiveData<Boolean> get() = _isProductCategoryUpdated

    private val _isProductCategoryDeleted = MutableLiveData<Boolean>()
    val isProductCategoryDeleted: LiveData<Boolean> get() = _isProductCategoryDeleted

    fun getProductsGroupedByCategory() {
        viewModelScope.launch {
            try {

                val apiService : ProductCategoryService = CreateInteface.createService()
                val productCategoryRepository = ProductCategoryRepository(apiService)
                val result = productCategoryRepository.getProductsGroupedByCategory()
                _responseProductCategoryList.value = result
//                Log.d("ProductCategoryViewModel", " product categories $result")
            } catch (e: Exception) {
                Log.e("ProductCategoryViewModel", "Error geting product categories", e)
                _responseProductCategoryList.value = null
            }finally {

            }
        }
    }

    fun getListProductsByCategoryId(id : String) {
        viewModelScope.launch {
            try {

                val apiService : ProductCategoryService = CreateInteface.createService()
                val productCategoryRepository = ProductCategoryRepository(apiService)
                val result = productCategoryRepository.getListProductsByCategoryId(id)
                _product.value = result
//                Log.d("ProductCategoryViewModel", " product  $result")
            } catch (e: Exception) {
                Log.e("ProductCategoryViewModel", "Error geting product ", e)
                _product.value = null
            }
        }
    }

    fun getProductCategories() {
        viewModelScope.launch {
            try {
                val apiService : ProductCategoryService = CreateInteface.createService()
                val productCategoryRepository = ProductCategoryRepository(apiService)
                val result = productCategoryRepository.getListProductCategory()
                _productCategoryList.value = result
            } catch (e: Exception) {
                Log.e("ProductCategoryViewModel", "Error geting product categories", e)
                _productCategoryList.value = null
            }
        }
    }

    fun addProductCategory(productCategory: ProductCategoryModel) {
        viewModelScope.launch {
            try {
                val apiService : ProductCategoryService = CreateInteface.createService()
                val productCategoryRepository = ProductCategoryRepository(apiService)
                val result = productCategoryRepository.addProductCategory(productCategory)
                _productCategory.value = result
                _isProductCategoryAdded.value = result != null
            } catch (e: Exception) {
                Log.e("ProductCategoryViewModel", "Error adding product category", e)
                _isProductCategoryAdded.value = false
            }
        }
    }

    fun getProductCategoryById(id: String) {
        viewModelScope.launch {
            try {
                val apiService : ProductCategoryService = CreateInteface.createService()
                val productCategoryRepository = ProductCategoryRepository(apiService)
                val result = productCategoryRepository.getProductCategoryById(id)
                _productCategory.value = result
            } catch (e: Exception) {
                Log.e("ProductCategoryViewModel", "Error geting product category by ID", e)
                _productCategory.value = null
            }
        }
    }

    fun updateProductCategory(id: String, productCategory: ProductCategoryModel) {
        viewModelScope.launch {
            try {
                val apiService : ProductCategoryService = CreateInteface.createService()
                val productCategoryRepository = ProductCategoryRepository(apiService)
                val result = productCategoryRepository.updateProductCategory(id, productCategory)
                _productCategory.value = result
                _isProductCategoryUpdated.value = result != null
            } catch (e: Exception) {
                Log.e("ProductCategoryViewModel", "Error updating product category", e)
                _isProductCategoryUpdated.value = false
            }
        }
    }

    fun deleteProductCategory(id: String) {
        viewModelScope.launch {
            try {
                val apiService : ProductCategoryService = CreateInteface.createService()
                val productCategoryRepository = ProductCategoryRepository(apiService)
                val isDeleted = productCategoryRepository.deleteProductCategory(id)
                _isProductCategoryDeleted.value = isDeleted
            } catch (e: Exception) {
                Log.e("ProductCategoryViewModel", "Error deleting product category", e)
                _isProductCategoryDeleted.value = false
            }
        }
    }
}