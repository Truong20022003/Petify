package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.CartRequest
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.data.server.repository.CartRepository
import com.example.petify.data.server.service.CartService
import kotlinx.coroutines.launch

class CartApiViewModel : BaseViewModel() {

    private val _cartList = MutableLiveData<List<CartResponse>?>()
    val cartList: LiveData<List<CartResponse>?> get() = _cartList

    private val _isCartAdded = MutableLiveData<Boolean>()
    val isCartAdded: LiveData<Boolean> get() = _isCartAdded

    private val _isCartUpdated = MutableLiveData<Boolean>()
    val isCartUpdated: LiveData<Boolean> get() = _isCartUpdated

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListCart(user_id : String) {
        viewModelScope.launch {
            try {
                val apiService: CartService = CreateInteface.createService()
                val cartRepository = CartRepository(apiService)
                _cartList.value = cartRepository.getListCart(user_id)
            } catch (e: Exception) {
                Log.e("CartViewModel", "Error fetching cart list", e)
                _errorMessage.value = "Error fetching cart list: ${e.message}"
            }
        }
    }

    fun addCart(cartRequest: CartRequest) {
        viewModelScope.launch {
            try {
                val apiService: CartService = CreateInteface.createService()
                val cartRepository = CartRepository(apiService)
                _isCartAdded.value = cartRepository.addCart(cartRequest) != null
            } catch (e: Exception) {
                Log.e("CartViewModel", "Error adding cart", e)
                _errorMessage.value = "Error adding cart: ${e.message}"
            }
        }
    }

    fun updateCartQuantity(cartRequest: CartRequest) {
        viewModelScope.launch {
            try {
                val apiService: CartService = CreateInteface.createService()
                val cartRepository = CartRepository(apiService)
                _isCartUpdated.value = cartRepository.updateCartQuantity(cartRequest) != null
            } catch (e: Exception) {
                Log.e("CartViewModel", "Error updating cart quantity", e)
                _errorMessage.value = "Error updating cart quantity: ${e.message}"
            }
        }
    }
    fun deleteCart(idProduct: String, idUser: String) {
        viewModelScope.launch {
            try {
                val apiService: CartService = CreateInteface.createService()
                val cartRepository = CartRepository(apiService)
                val result = cartRepository.deleteCart(idProduct, idUser)
                if (result == null) {
                    Log.e("CartApiViewModel", "Error: No result received from API")
                } else {
                    Log.d("CartApiViewModel", "Delete success")
                }
            } catch (e: Exception) {
                Log.e("CartApiViewModel", "deleteCart: Error occurred", e)
            }
        }
    }



}
