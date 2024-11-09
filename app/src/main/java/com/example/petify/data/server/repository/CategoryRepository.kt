package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.CategoryModel
import com.example.petify.data.server.service.CategoryService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CategoryRepository(private val api : CategoryService) {
    suspend fun getListCategory(): List<CategoryModel>? = withContext(Dispatchers.IO) {
        val response = api.getListCategory()
        if (response.isSuccessful) {
            Log.d("CategoryRepository", "getListCategory Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CategoryRepository", "getListCategory Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addCategory(Category: CategoryModel): CategoryModel? = withContext(Dispatchers.IO) {
        val response = api.addCategory(Category)
        if (response.isSuccessful) {
            Log.d("CategoryRepository", "addCategory Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CategoryRepository", "addCategory Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getCategoryById(id: String): CategoryModel? = withContext(Dispatchers.IO) {
        val response = api.getCategoryById(id)
        if (response.isSuccessful) {
            Log.d("CategoryRepository", "getCategoryById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CategoryRepository", "getCategoryById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateCategory(id: String, Category: CategoryModel): CategoryModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateCategory(id, Category)
        if (response.isSuccessful) {
            Log.d("CategoryRepository", "updateCategory Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CategoryRepository", "updateCategory Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteCategory(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteCategory(id)
        if (response.isSuccessful) {
            Log.d("CategoryRepository", "deleteCategory Success")
            true
        } else {
            Log.e("CategoryRepository", "deleteCategory Error: ${response.errorBody()}")
            false
        }
    }
}