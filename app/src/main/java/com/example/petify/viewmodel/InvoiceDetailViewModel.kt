package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitity.InvoiceDetailModel
import com.example.petify.data.server.repository.InvoiceDetailRepository
import com.example.petify.data.server.repository.UserRepository
import kotlinx.coroutines.launch

class InvoiceDetailViewModel : BaseViewModel() {

    private val _invoiceDetailList = MutableLiveData<List<InvoiceDetailModel>?>()
    val invoiceDetailList: LiveData<List<InvoiceDetailModel>?> get() = _invoiceDetailList

    private val _invoiceDetail = MutableLiveData<InvoiceDetailModel?>()
    val invoiceDetail: LiveData<InvoiceDetailModel?> get() = _invoiceDetail

    private val _isInvoiceDetailAdded = MutableLiveData<Boolean>()
    val isInvoiceDetailAdded: LiveData<Boolean> get() = _isInvoiceDetailAdded

    private val _isInvoiceDetailUpdated = MutableLiveData<Boolean>()
    val isInvoiceDetailUpdated: LiveData<Boolean> get() = _isInvoiceDetailUpdated

    private val _isInvoiceDetailDeleted = MutableLiveData<Boolean>()
    val isInvoiceDetailDeleted: LiveData<Boolean> get() = _isInvoiceDetailDeleted

    fun fetchInvoiceDetails() {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoiceDetail()
                val invoiceDetailRepository = InvoiceDetailRepository(apiService)
                val result = invoiceDetailRepository.getListInvoiceDetail()
                _invoiceDetailList.value = result
            } catch (e: Exception) {
                Log.e("InvoiceDetailViewModel", "Error fetching invoice details", e)
                _invoiceDetailList.value = null
            }
        }
    }

    fun addInvoiceDetail(invoiceDetail: InvoiceDetailModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoiceDetail()
                val invoiceDetailRepository = InvoiceDetailRepository(apiService)
                val result = invoiceDetailRepository.addInvoiceDetail(invoiceDetail)
                _invoiceDetail.value = result
                _isInvoiceDetailAdded.value = result != null
            } catch (e: Exception) {
                Log.e("InvoiceDetailViewModel", "Error adding invoice detail", e)
                _isInvoiceDetailAdded.value = false
            }
        }
    }

    fun fetchInvoiceDetailById(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoiceDetail()
                val invoiceDetailRepository = InvoiceDetailRepository(apiService)
                val result = invoiceDetailRepository.getInvoiceDetailById(id)
                _invoiceDetail.value = result
            } catch (e: Exception) {
                Log.e("InvoiceDetailViewModel", "Error fetching invoice detail by ID", e)
                _invoiceDetail.value = null
            }
        }
    }

    fun updateInvoiceDetail(id: String, invoiceDetail: InvoiceDetailModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoiceDetail()
                val invoiceDetailRepository = InvoiceDetailRepository(apiService)
                val result = invoiceDetailRepository.updateInvoiceDetail(id, invoiceDetail)
                _invoiceDetail.value = result
                _isInvoiceDetailUpdated.value = result != null
            } catch (e: Exception) {
                Log.e("InvoiceDetailViewModel", "Error updating invoice detail", e)
                _isInvoiceDetailUpdated.value = false
            }
        }
    }

    fun deleteInvoiceDetail(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoiceDetail()
                val invoiceDetailRepository = InvoiceDetailRepository(apiService)
                val isDeleted = invoiceDetailRepository.deleteInvoiceDetail(id)
                _isInvoiceDetailDeleted.value = isDeleted
            } catch (e: Exception) {
                Log.e("InvoiceDetailViewModel", "Error deleting invoice detail", e)
                _isInvoiceDetailDeleted.value = false
            }
        }
    }
}