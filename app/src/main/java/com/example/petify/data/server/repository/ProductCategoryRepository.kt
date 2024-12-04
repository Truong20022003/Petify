package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.CategoryWithProductsModel
import com.example.petify.data.server.enitities.ProductCategoryModel
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.data.server.service.ProductCategoryService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ProductCategoryRepository(private val api: ProductCategoryService) {

    suspend fun getListProductCategory(): List<ProductCategoryModel>? = withContext(Dispatchers.IO) {
        val response = api.getListProductCategory()
        if (response.isSuccessful) {
            Log.d("ProductCategoryRepository", "getListProductCategory Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductCategoryRepository", "getListProductCategory Error: ${response.errorBody()}")
            null
        }
    }
    suspend fun getListProductsByCategoryId(id : String): List<ProductModel>? = withContext(Dispatchers.IO) {
        val response = api.getListProductsByCategoryId(id)
        if (response.isSuccessful) {
            Log.d("ProductCategoryRepository", "getListProductCategory Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductCategoryRepository", "getListProductCategory Error: ${response.errorBody()}")
            null
        }
    }
    suspend fun getProductsGroupedByCategory(): List<CategoryWithProductsModel>? = withContext(Dispatchers.IO) {
        val response = api.getProductsGroupedByCategory()
        if (response.isSuccessful) {
            val responseBody = response.body()
            Log.d("ProductCategoryRepository", "getProductsGroupedByCategory Success: ${responseBody?.result}")
            responseBody?.result
        } else {
            Log.e("ProductCategoryRepository", "getProductsGroupedByCategory Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addProductCategory(ProductCategory: ProductCategoryModel): ProductCategoryModel? = withContext(Dispatchers.IO) {
        val response = api.addProductCategory(ProductCategory)
        if (response.isSuccessful) {
            Log.d("ProductCategoryRepository", "addProductCategory Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductCategoryRepository", "addProductCategory Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getProductCategoryById(id: String): ProductCategoryModel? = withContext(Dispatchers.IO) {
        val response = api.getProductCategoryById(id)
        if (response.isSuccessful) {
            Log.d("ProductCategoryRepository", "getProductCategoryById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductCategoryRepository", "getProductCategoryById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateProductCategory(id: String, ProductCategory: ProductCategoryModel): ProductCategoryModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateProductCategory(id, ProductCategory)
        if (response.isSuccessful) {
            Log.d("ProductCategoryRepository", "updateProductCategory Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductCategoryRepository", "updateProductCategory Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteProductCategory(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteProductCategory(id)
        if (response.isSuccessful) {
            Log.d("ProductCategoryRepository", "deleteProductCategory Success")
            true
        } else {
            Log.e("ProductCategoryRepository", "deleteProductCategory Error: ${response.errorBody()}")
            false
        }
    }
}