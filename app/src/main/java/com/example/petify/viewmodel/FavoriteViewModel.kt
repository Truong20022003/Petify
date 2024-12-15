package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.FavoriteRequest
import com.example.petify.data.server.enitities.FavoriteResponse
import com.example.petify.data.server.repository.FavoriteRepository
import com.example.petify.data.server.service.FavoriteService
import kotlinx.coroutines.launch

class FavoriteViewModel : BaseViewModel() {

    private val _favoriteList = MutableLiveData<List<FavoriteResponse>?>()
    val favoriteList: LiveData<List<FavoriteResponse>?> get() = _favoriteList

    private val _isFavoriteAdded = MutableLiveData<Boolean>()
    val isFavoriteAdded: LiveData<Boolean> get() = _isFavoriteAdded

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun updateFavoriteList(favoriteList: List<FavoriteResponse>) {
        _favoriteList.value = favoriteList
    }


    fun getListFavorites(user_id : String) {
        viewModelScope.launch {
            try {
                val apiService: FavoriteService = CreateInteface.createService()
                val favoriteRepository = FavoriteRepository(apiService)
                _favoriteList.value = favoriteRepository.getListFavorites(user_id)
            } catch (e: Exception) {
                Log.e("FavoriteViewModel", "Error fetching favorites list", e)
                _errorMessage.value = "Error fetching favorites list: ${e.message}"
            }
        }
    }

    fun addFavorites(favoriteRequest: FavoriteRequest) {
        viewModelScope.launch {
            try {
                val apiService: FavoriteService = CreateInteface.createService()
                val favoriteRepository = FavoriteRepository(apiService)
                _isFavoriteAdded.value = favoriteRepository.addFavorites(favoriteRequest) != null
            } catch (e: Exception) {
                Log.e("FavoriteViewModel", "Error adding favorite", e)
                _errorMessage.value = "Error adding favorite: ${e.message}"
            }
        }
    }
    fun deleteFavorite(idProduct: String, idUser: String) {
        viewModelScope.launch {
            try {
                val apiService: FavoriteService = CreateInteface.createService()
                val favoriteRepository = FavoriteRepository(apiService)
                val result = favoriteRepository.deleteFavorite(idProduct, idUser)
                if (result) {
                    Log.d("FavoriteViewModel", "deleteFavorite: Success")
                } else {
                    Log.e("FavoriteViewModel", "deleteFavorite: Failed")
                }
            } catch (e: Exception) {
                Log.e("FavoriteViewModel", "deleteFavorite: Error occurred", e)
            }
        }
    }

}


