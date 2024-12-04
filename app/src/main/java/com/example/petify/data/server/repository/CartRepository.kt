package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.CartRequest
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.data.server.service.CartService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CartRepository(private val api: CartService) {

    suspend fun getListCart(user_id : String): List<CartResponse>? = withContext(Dispatchers.IO) {
        val response = api.getListCart(user_id)
        if (response.isSuccessful) {
            Log.d("CartRepository", "getListCart Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CartRepository", "getListCart Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addCart(cartRequest: CartRequest): CartRequest? = withContext(Dispatchers.IO) {
        val response = api.addCart(cartRequest)
        if (response.isSuccessful) {
            Log.d("CartRepository", "addCart Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CartRepository", "addCart Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateCartQuantity(cartRequest: CartRequest): CartRequest? = withContext(Dispatchers.IO) {
        val response = api.updateCartQuantity(cartRequest)
        if (response.isSuccessful) {
            Log.d("CartRepository", "updateCartQuantity Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CartRepository", "updateCartQuantity Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteCart(idProduct: String, idUser: String): CartRequest? = withContext(Dispatchers.IO) {
        val response = api.deleteCart(idProduct,idUser)
        if (response.isSuccessful) {
            Log.d("CartRepository", "deleteInvoiceDetail Success")
        response.body()
        } else {
            Log.e("CartRepository", "deleteInvoiceDetail Error: ${response.errorBody()}")
           null
        }
    }
}
