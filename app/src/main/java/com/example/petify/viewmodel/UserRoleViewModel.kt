package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.UserRoleModel
import com.example.petify.data.server.repository.UserRoleRepository
import com.example.petify.data.server.service.SupplierService
import com.example.petify.data.server.service.UserRoleService
import kotlinx.coroutines.launch

class UserRoleViewModel : BaseViewModel() {
    private val _userRoleList = MutableLiveData<List<UserRoleModel>?>()
    val userRoleList: LiveData<List<UserRoleModel>?> get() = _userRoleList

    private val _userRole = MutableLiveData<UserRoleModel?>()
    val userRole: LiveData<UserRoleModel?> get() = _userRole

    private val _isUserRoleAdded = MutableLiveData<Boolean>()
    val isUserRoleAdded: LiveData<Boolean> get() = _isUserRoleAdded

    private val _isUserRoleUpdated = MutableLiveData<Boolean>()
    val isUserRoleUpdated: LiveData<Boolean> get() = _isUserRoleUpdated

    private val _isUserRoleDeleted = MutableLiveData<Boolean>()
    val isUserRoleDeleted: LiveData<Boolean> get() = _isUserRoleDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListUserRole() {
        viewModelScope.launch {
            try {
                val apiService: UserRoleService = CreateInteface.createService()
                val userRoleRepository = UserRoleRepository(apiService)
                _userRoleList.value = userRoleRepository.getListUserRole()
            } catch (e: Exception) {
                Log.e("UserRoleViewModel", "Error fetching user role list", e)
                _errorMessage.value = "Error fetching user role list: ${e.message}"
            }
        }
    }

    fun addUserRole(userRole: UserRoleModel) {
        viewModelScope.launch {
            try {
                val apiService: UserRoleService = CreateInteface.createService()
                val userRoleRepository = UserRoleRepository(apiService)
                _isUserRoleAdded.value = userRoleRepository.addUserRole(userRole) != null
            } catch (e: Exception) {
                Log.e("UserRoleViewModel", "Error adding user role", e)
                _errorMessage.value = "Error adding user role: ${e.message}"
            }
        }
    }

    fun getUserRoleById(id: String) {
        viewModelScope.launch {
            try {
                val apiService: UserRoleService = CreateInteface.createService()
                val userRoleRepository = UserRoleRepository(apiService)
                _userRole.value = userRoleRepository.getUserRoleById(id)
            } catch (e: Exception) {
                Log.e("UserRoleViewModel", "Error fetching user role by ID", e)
                _errorMessage.value = "Error fetching user role by ID: ${e.message}"
            }
        }
    }

    fun updateUserRole(id: String, userRole: UserRoleModel) {
        viewModelScope.launch {
            try {
                val apiService: UserRoleService = CreateInteface.createService()
                val userRoleRepository = UserRoleRepository(apiService)
                _isUserRoleUpdated.value = userRoleRepository.updateUserRole(id, userRole) != null
            } catch (e: Exception) {
                Log.e("UserRoleViewModel", "Error updating user role", e)
                _errorMessage.value = "Error updating user role: ${e.message}"
            }
        }
    }

    fun deleteUserRole(id: String) {
        viewModelScope.launch {
            try {
                val apiService: UserRoleService = CreateInteface.createService()
                val userRoleRepository = UserRoleRepository(apiService)
                _isUserRoleDeleted.value = userRoleRepository.deleteUserRole(id)
            } catch (e: Exception) {
                Log.e("UserRoleViewModel", "Error deleting user role", e)
                _errorMessage.value = "Error deleting user role: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }

}