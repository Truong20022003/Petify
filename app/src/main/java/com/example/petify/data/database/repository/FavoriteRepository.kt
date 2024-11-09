package com.example.petify.data.database.repository

import com.example.petify.data.database.dao.FavoriteDao
import com.example.petify.data.database.enitities.FavoriteItem

class FavoriteRepository(private val favoriteDao: FavoriteDao) {
    suspend fun addFavorite(item: FavoriteItem) = favoriteDao.addFavorite(item)
    suspend fun removeFavorite(item: FavoriteItem) = favoriteDao.removeFavorite(item)
    suspend fun getAllFavorites() = favoriteDao.getAllFavorites()
}