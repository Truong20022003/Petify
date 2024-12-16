package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.CartRequest
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.data.server.enitities.CartResponseAndStatus
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
    private val _isCartDelete = MutableLiveData<Boolean>()
    val isCartDelete: LiveData<Boolean> get() = _isCartDelete

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    private val _cartResponse = MutableLiveData<CartResponseAndStatus?>()
    val cartResponse: LiveData<CartResponseAndStatus?> get() = _cartResponse

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
                val response = cartRepository.addCart(cartRequest)

                if (response != null) {
                    _cartResponse.value = response
                } else {
                    _errorMessage.value = "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại."
                }
            } catch (e: Exception) {
                Log.e("CartViewModel", "Error adding cart", e)
                _errorMessage.value = "Lỗi khi thêm sản phẩm vào giỏ hàng: ${e.message}"
            }
        }
    }
    fun clearCartResponse() {
        _cartResponse.value = null
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
                _isCartDelete.value = result != null
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
