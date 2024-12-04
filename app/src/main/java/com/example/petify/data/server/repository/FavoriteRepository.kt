package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.FavoriteRequest
import com.example.petify.data.server.enitities.FavoriteResponse
import com.example.petify.data.server.service.FavoriteService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class FavoriteRepository(private val api: FavoriteService) {

    suspend fun getListFavorites(): List<FavoriteResponse>? = withContext(Dispatchers.IO) {
        val response = api.getListFavorites()
        if (response.isSuccessful) {
            Log.d("FavoriteRepository", "getListFavorites Success: ${response.body()}")
            response.body()
        } else {
            Log.e("FavoriteRepository", "getListFavorites Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addFavorites(favoriteRequest: FavoriteRequest): FavoriteRequest? = withContext(Dispatchers.IO) {
        val response = api.addFavorites(favoriteRequest)
        if (response.isSuccessful) {
            Log.d("FavoriteRepository", "addFavorites Success: ${response.body()}")
            response.body()
        } else {
            Log.e("FavoriteRepository", "addFavorites Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteFavorite(idProduct: String, idUser: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteFavorites(idProduct,idUser)
        if (response.isSuccessful) {
            Log.d("CartRepository", "deleteInvoiceDetail Success")
            true
        } else {
            Log.e("CartRepository", "deleteInvoiceDetail Error: ${response.errorBody()}")
            false
        }
    }
}
