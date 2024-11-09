package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.RoleModel
import com.example.petify.data.server.repository.RoleRepository
import kotlinx.coroutines.launch

class RoleViewModel : BaseViewModel() {

    private val _roleList = MutableLiveData<List<RoleModel>?>()
    val roleList: LiveData<List<RoleModel>?> get() = _roleList

    private val _role = MutableLiveData<RoleModel?>()
    val role: LiveData<RoleModel?> get() = _role

    private val _isRoleAdded = MutableLiveData<Boolean>()
    val isRoleAdded: LiveData<Boolean> get() = _isRoleAdded

    private val _isRoleUpdated = MutableLiveData<Boolean>()
    val isRoleUpdated: LiveData<Boolean> get() = _isRoleUpdated

    private val _isRoleDeleted = MutableLiveData<Boolean>()
    val isRoleDeleted: LiveData<Boolean> get() = _isRoleDeleted

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getListRole() {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createRole()
                val roleRepository = RoleRepository(apiService)
                _roleList.value = roleRepository.getListRole()
            } catch (e: Exception) {
                Log.e("RoleViewModel", "Error fetching role list", e)
                _errorMessage.value = "Error fetching role list: ${e.message}"
            }
        }
    }

    fun addRole(role: RoleModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createRole()
                val roleRepository = RoleRepository(apiService)
                _isRoleAdded.value = roleRepository.addRole(role) != null
            } catch (e: Exception) {
                Log.e("RoleViewModel", "Error adding role", e)
                _errorMessage.value = "Error adding role: ${e.message}"
            }
        }
    }

    fun getRoleById(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createRole()
                val roleRepository = RoleRepository(apiService)
                _role.value = roleRepository.getRoleById(id)
            } catch (e: Exception) {
                Log.e("RoleViewModel", "Error fetching role by ID", e)
                _errorMessage.value = "Error fetching role by ID: ${e.message}"
            }
        }
    }

    fun updateRole(id: String, role: RoleModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createRole()
                val roleRepository = RoleRepository(apiService)
                _isRoleUpdated.value = roleRepository.updateRole(id, role) != null
            } catch (e: Exception) {
                Log.e("RoleViewModel", "Error updating role", e)
                _errorMessage.value = "Error updating role: ${e.message}"
            }
        }
    }

    fun deleteRole(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createRole()
                val roleRepository = RoleRepository(apiService)
                _isRoleDeleted.value = roleRepository.deleteRole(id)
            } catch (e: Exception) {
                Log.e("RoleViewModel", "Error deleting role", e)
                _errorMessage.value = "Error deleting role: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }

}