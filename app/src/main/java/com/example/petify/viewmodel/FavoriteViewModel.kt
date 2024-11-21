package com.example.petify.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.database.enitities.FavoriteItem
import com.example.petify.data.database.repository.FavoriteRepository
import kotlinx.coroutines.launch

class FavoriteViewModel(private val favoriteRepository: FavoriteRepository) : BaseViewModel() {

    private val _favoriteItems = MutableLiveData<List<FavoriteItem>?>()
    val favoriteItems: LiveData<List<FavoriteItem>?> get() = _favoriteItems

    fun fetchFavoriteItems() {
        viewModelScope.launch {
            _favoriteItems.value = favoriteRepository.getAllFavorites()
        }
    }

    fun addFavorite(item: FavoriteItem) {
        viewModelScope.launch {
            favoriteRepository.addFavorite(item)
            fetchFavoriteItems()
        }
    }

    fun removeFavorite(item: FavoriteItem) {
        viewModelScope.launch {
            favoriteRepository.removeFavorite(item)
            fetchFavoriteItems()
        }
    }
}
