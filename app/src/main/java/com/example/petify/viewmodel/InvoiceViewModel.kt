package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.InvoiceModel
import com.example.petify.data.server.repository.InvoiceRepository
import kotlinx.coroutines.launch

class InvoiceViewModel : BaseViewModel() {
    private val _invoiceList = MutableLiveData<List<InvoiceModel>?>()
    val invoiceList: LiveData<List<InvoiceModel>?> get() = _invoiceList

    private val _invoice = MutableLiveData<InvoiceModel?>()
    val invoice: LiveData<InvoiceModel?> get() = _invoice

    private val _isInvoiceAdded = MutableLiveData<Boolean>()
    val isInvoiceAdded: LiveData<Boolean> get() = _isInvoiceAdded

    private val _isInvoiceUpdated = MutableLiveData<Boolean>()
    val isInvoiceUpdated: LiveData<Boolean> get() = _isInvoiceUpdated

    private val _isInvoiceDeleted = MutableLiveData<Boolean>()
    val isInvoiceDeleted: LiveData<Boolean> get() = _isInvoiceDeleted

    fun getInvoices() {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoice()
                val invoiceRepository = InvoiceRepository(apiService)
                val result = invoiceRepository.getListInvoice()
                _invoiceList.value = result
            } catch (e: Exception) {
                Log.e("InvoiceViewModel", "Error geting invoices", e)
                _invoiceList.value = null
            }
        }
    }

    fun addInvoice(invoice: InvoiceModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoice()
                val invoiceRepository = InvoiceRepository(apiService)
                val result = invoiceRepository.addInvoice(invoice)
                _invoice.value = result
                _isInvoiceAdded.value = result != null
            } catch (e: Exception) {
                Log.e("InvoiceViewModel", "Error adding invoice", e)
                _isInvoiceAdded.value = false
            }
        }
    }

    fun getInvoiceById(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoice()
                val invoiceRepository = InvoiceRepository(apiService)
                val result = invoiceRepository.getInvoiceById(id)
                _invoice.value = result
            } catch (e: Exception) {
                Log.e("InvoiceViewModel", "Error geting invoice by ID", e)
                _invoice.value = null
            }
        }
    }

    fun updateInvoice(id: String, invoice: InvoiceModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoice()
                val invoiceRepository = InvoiceRepository(apiService)
                val result = invoiceRepository.updateInvoice(id, invoice)
                _invoice.value = result
                _isInvoiceUpdated.value = result != null
            } catch (e: Exception) {
                Log.e("InvoiceViewModel", "Error updating invoice", e)
                _isInvoiceUpdated.value = false
            }
        }
    }

    fun deleteInvoice(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createInvoice()
                val invoiceRepository = InvoiceRepository(apiService)
                val isDeleted = invoiceRepository.deleteInvoice(id)
                _isInvoiceDeleted.value = isDeleted
            } catch (e: Exception) {
                Log.e("InvoiceViewModel", "Error deleting invoice", e)
                _isInvoiceDeleted.value = false
            }
        }
    }
}