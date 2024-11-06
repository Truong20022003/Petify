package com.example.petify.ui.home

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitity.CategoryModel
import com.example.petify.data.server.repository.CategoryRepository
import kotlinx.coroutines.launch


class CategoryViewModel : BaseViewModel() {

    val category = MutableLiveData<List<CategoryModel>>()
    val categoryList: LiveData<List<CategoryModel>> get() = category

    fun getAllCategories() {
        viewModelScope.launch {
            try {
                val categoryService = CreateInteface.createCategory()
                val categoryRepository = CategoryRepository(categoryService)
                val result = categoryRepository.getListCategory()
                result?.let {
                    Log.d("TAG12345_List", "Category: $it")
                    category.value = it
                }
            } catch (e: Exception) {
                Log.d("TAG12345", e.message.toString())
            }

        }
    }


}