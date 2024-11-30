package com.example.petify.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.petify.data.database.dao.CartDao

class CartViewModelFactory(private val cartDao: CartDao) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CartViewModel::class.java)) {
            return CartViewModel(cartDao) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
