package com.example.petify.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.data.database.repository.CartRepository
import com.example.petify.data.database.dao.CartDao
import kotlinx.coroutines.launch

class CartViewModel(cartDao: CartDao) : BaseViewModel(), ViewModelProvider.Factory {

    private val cartRepository = CartRepository(cartDao)

    private val _cartItems = MutableLiveData<List<CartItem>?>()
    val cartItems: LiveData<List<CartItem>?> get() = _cartItems

    fun fetchCartItems() {
        cartRepository.getAllCartItems().observeForever { items ->
            _cartItems.value = items
        }
    }

    fun addToCart(item: CartItem) {
        viewModelScope.launch {
            cartRepository.addToCart(item)
        }
    }

    fun removeFromCart(productId: String) {
        viewModelScope.launch {
            cartRepository.removeFromCart(productId)
        }
    }

    fun updateQuantity(productId: String, quantity: Int) {
        viewModelScope.launch {
            cartRepository.updateQuantity(productId, quantity)
        }
    }
}
