package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.CategoryModel
import com.example.petify.data.server.repository.CategoryRepository
import kotlinx.coroutines.launch

class CategoryViewModel : BaseViewModel() {

    private val _categoryList = MutableLiveData<List<CategoryModel>?>()
    val categoryList: LiveData<List<CategoryModel>?> get() = _categoryList

    private val _category = MutableLiveData<CategoryModel?>()
    val category: LiveData<CategoryModel?> get() = _category

    private val _isCategoryAdded = MutableLiveData<Boolean>()
    val isCategoryAdded: LiveData<Boolean> get() = _isCategoryAdded

    private val _isCategoryUpdated = MutableLiveData<Boolean>()
    val isCategoryUpdated: LiveData<Boolean> get() = _isCategoryUpdated

    private val _isCategoryDeleted = MutableLiveData<Boolean>()
    val isCategoryDeleted: LiveData<Boolean> get() = _isCategoryDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListCategory() {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createCategory()
                val categoryRepository = CategoryRepository(apiService)
                _categoryList.value = categoryRepository.getListCategory()
            } catch (e: Exception) {
                Log.e("CategoryViewModel", "Error fetching category list", e)
                _errorMessage.value = "Error fetching category list: ${e.message}"
            }
        }
    }

    fun addCategory(category: CategoryModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createCategory()
                val categoryRepository = CategoryRepository(apiService)
                _isCategoryAdded.value = categoryRepository.addCategory(category) != null
            } catch (e: Exception) {
                Log.e("CategoryViewModel", "Error adding category", e)
                _errorMessage.value = "Error adding category: ${e.message}"
            }
        }
    }

    fun getCategoryById(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createCategory()
                val categoryRepository = CategoryRepository(apiService)
                _category.value = categoryRepository.getCategoryById(id)
            } catch (e: Exception) {
                Log.e("CategoryViewModel", "Error fetching category by ID", e)
                _errorMessage.value = "Error fetching category by ID: ${e.message}"
            }
        }
    }

    fun updateCategory(id: String, category: CategoryModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createCategory()
                val categoryRepository = CategoryRepository(apiService)
                _isCategoryUpdated.value = categoryRepository.updateCategory(id, category) != null
            } catch (e: Exception) {
                Log.e("CategoryViewModel", "Error updating category", e)
                _errorMessage.value = "Error updating category: ${e.message}"
            }
        }
    }

    fun deleteCategory(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createCategory()
                val categoryRepository = CategoryRepository(apiService)
                _isCategoryDeleted.value = categoryRepository.deleteCategory(id)
            } catch (e: Exception) {
                Log.e("CategoryViewModel", "Error deleting category", e)
                _errorMessage.value = "Error deleting category: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}