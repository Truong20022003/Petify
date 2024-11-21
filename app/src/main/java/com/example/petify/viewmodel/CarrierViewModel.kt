package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.CarrierModel
import com.example.petify.data.server.repository.CarrierRepository
import com.example.petify.data.server.service.CarrierService
import kotlinx.coroutines.launch

class CarrierViewModel : BaseViewModel() {
    private val _carrierList = MutableLiveData<List<CarrierModel>?>()
    val carrierList: LiveData<List<CarrierModel>?> get() = _carrierList

    private val _carrier = MutableLiveData<CarrierModel?>()
    val carrier: LiveData<CarrierModel?> get() = _carrier

    private val _isCarrierAdded = MutableLiveData<Boolean>()
    val isCarrierAdded: LiveData<Boolean> get() = _isCarrierAdded

    private val _isCarrierUpdated = MutableLiveData<Boolean>()
    val isCarrierUpdated: LiveData<Boolean> get() = _isCarrierUpdated

    private val _isCarrierDeleted = MutableLiveData<Boolean>()
    val isCarrierDeleted: LiveData<Boolean> get() = _isCarrierDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListCarrier() {
        viewModelScope.launch {
            try {

                val apiService : CarrierService = CreateInteface.createService()
                val carrierRepository = CarrierRepository(apiService)
                _carrierList.value = carrierRepository.getListCarrier()
            } catch (e: Exception) {
                Log.e("CarrierViewModel", "Error fetching carrier list", e)
                _errorMessage.value = "Error fetching carrier list: ${e.message}"
            }
        }
    }

    fun addCarrier(carrier: CarrierModel) {
        viewModelScope.launch {
            try {
                val apiService : CarrierService = CreateInteface.createService()
                val carrierRepository = CarrierRepository(apiService)
                _isCarrierAdded.value = carrierRepository.addCarrier(carrier) != null
            } catch (e: Exception) {
                Log.e("CarrierViewModel", "Error adding carrier", e)
                _errorMessage.value = "Error adding carrier: ${e.message}"
            }
        }
    }

    fun getCarrierById(id: String) {
        viewModelScope.launch {
            try {
                val apiService : CarrierService = CreateInteface.createService()
                val carrierRepository = CarrierRepository(apiService)
                _carrier.value = carrierRepository.getCarrierById(id)
            } catch (e: Exception) {
                Log.e("CarrierViewModel", "Error fetching carrier by ID", e)
                _errorMessage.value = "Error fetching carrier by ID: ${e.message}"
            }
        }
    }

    fun updateCarrier(id: String, carrier: CarrierModel) {
        viewModelScope.launch {
            try {
                val apiService : CarrierService = CreateInteface.createService()
                val carrierRepository = CarrierRepository(apiService)
                _isCarrierUpdated.value = carrierRepository.updateCarrier(id, carrier) != null
            } catch (e: Exception) {
                Log.e("CarrierViewModel", "Error updating carrier", e)
                _errorMessage.value = "Error updating carrier: ${e.message}"
            }
        }
    }

    fun deleteCarrier(id: String) {
        viewModelScope.launch {
            try {
                val apiService : CarrierService = CreateInteface.createService()
                val carrierRepository = CarrierRepository(apiService)
                _isCarrierDeleted.value = carrierRepository.deleteCarrier(id)
            } catch (e: Exception) {
                Log.e("CarrierViewModel", "Error deleting carrier", e)
                _errorMessage.value = "Error deleting carrier: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}