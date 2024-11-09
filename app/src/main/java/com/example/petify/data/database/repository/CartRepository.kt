package com.example.petify.data.database.repository

import com.example.petify.data.database.dao.CartDao
import com.example.petify.data.database.enitities.CartItem

class CartRepository(private val cartDao: CartDao) {
    suspend fun addToCart(item: CartItem) = cartDao.addToCart(item)
    suspend fun removeFromCart(productId: String) = cartDao.removeFromCart(productId)
    suspend fun updateQuantity(productId: String, quantity: Int) =
        cartDao.updateQuantity(productId, quantity)

    suspend fun getAllCartItems() = cartDao.getAllCartItems()
}