package com.example.petify.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.data.database.repository.CartRepository
import kotlinx.coroutines.launch

class CartViewModel(private val cartRepository: CartRepository) : BaseViewModel() {

    private val _cartItems = MutableLiveData<List<CartItem>?>()
    val cartItems: LiveData<List<CartItem>?> get() = _cartItems

    fun fetchCartItems() {
        viewModelScope.launch {
            _cartItems.value = cartRepository.getAllCartItems()
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
