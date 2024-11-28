package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.SupplierModel
import com.example.petify.data.server.repository.SupplierRepository
import com.example.petify.data.server.service.RoleService
import com.example.petify.data.server.service.SupplierService
import kotlinx.coroutines.launch

class SupplierViewModel : BaseViewModel() {
    private val _supplierList = MutableLiveData<List<SupplierModel>?>()
    val supplierList: LiveData<List<SupplierModel>?> get() = _supplierList

    private val _supplier = MutableLiveData<SupplierModel?>()
    val supplier: LiveData<SupplierModel?> get() = _supplier

    private val _isSupplierAdded = MutableLiveData<Boolean>()
    val isSupplierAdded: LiveData<Boolean> get() = _isSupplierAdded

    private val _isSupplierUpdated = MutableLiveData<Boolean>()
    val isSupplierUpdated: LiveData<Boolean> get() = _isSupplierUpdated

    private val _isSupplierDeleted = MutableLiveData<Boolean>()
    val isSupplierDeleted: LiveData<Boolean> get() = _isSupplierDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListSupplier() {
        viewModelScope.launch {
            try {
                val apiService: SupplierService = CreateInteface.createService()
                val supplierRepository = SupplierRepository(apiService)
                _supplierList.value = supplierRepository.getListSupplier()
            } catch (e: Exception) {
                Log.e("SupplierViewModel", "Error fetching supplier list", e)
                _errorMessage.value = "Error fetching supplier list: ${e.message}"
            }
        }
    }

    fun addSupplier(supplier: SupplierModel) {
        viewModelScope.launch {
            try {
                val apiService: SupplierService = CreateInteface.createService()
                val supplierRepository = SupplierRepository(apiService)
                _isSupplierAdded.value = supplierRepository.addSupplier(supplier) != null
            } catch (e: Exception) {
                Log.e("SupplierViewModel", "Error adding supplier", e)
                _errorMessage.value = "Error adding supplier: ${e.message}"
            }
        }
    }

    fun getSupplierById(id: String) {
        viewModelScope.launch {
            try {
                val apiService: SupplierService = CreateInteface.createService()
                val supplierRepository = SupplierRepository(apiService)
                _supplier.value = supplierRepository.getSupplierById(id)
            } catch (e: Exception) {
                Log.e("SupplierViewModel", "Error fetching supplier by ID", e)
                _errorMessage.value = "Error fetching supplier by ID: ${e.message}"
            }
        }
    }

    fun updateSupplier(id: String, supplier: SupplierModel) {
        viewModelScope.launch {
            try {
                val apiService: SupplierService = CreateInteface.createService()
                val supplierRepository = SupplierRepository(apiService)
                _isSupplierUpdated.value = supplierRepository.updateSupplier(id, supplier) != null
            } catch (e: Exception) {
                Log.e("SupplierViewModel", "Error updating supplier", e)
                _errorMessage.value = "Error updating supplier: ${e.message}"
            }
        }
    }

    fun deleteSupplier(id: String) {
        viewModelScope.launch {
            try {
                val apiService: SupplierService = CreateInteface.createService()
                val supplierRepository = SupplierRepository(apiService)
                _isSupplierDeleted.value = supplierRepository.deleteSupplier(id)
            } catch (e: Exception) {
                Log.e("SupplierViewModel", "Error deleting supplier", e)
                _errorMessage.value = "Error deleting supplier: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}