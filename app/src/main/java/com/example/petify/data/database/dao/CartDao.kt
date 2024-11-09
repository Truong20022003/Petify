package com.example.petify.data.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.petify.data.database.enitities.CartItem

@Dao
interface CartDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun addToCart(item: CartItem)

    @Query("SELECT * FROM cart_items")
    suspend fun getAllCartItems(): List<CartItem>

    @Query("DELETE FROM cart_items WHERE id = :productId")
    suspend fun removeFromCart(productId: String)

    @Query("UPDATE cart_items SET quantity = :quantity WHERE id = :productId")
    suspend fun updateQuantity(productId: String, quantity: Int)
}
