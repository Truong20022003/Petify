package com.example.petify.data.database.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.petify.data.database.enitities.FavoriteItem

@Dao
interface FavoriteDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun addFavorite(item: FavoriteItem)

    @Query("SELECT * FROM favorite_items")
    suspend fun getAllFavorites(): List<FavoriteItem>

    @Delete
    suspend fun removeFavorite(item: FavoriteItem)
}

