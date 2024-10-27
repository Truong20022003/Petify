package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitity.InvoiceModel
import com.example.petify.data.server.service.InvoiceService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class InvoiceRepository(private val api : InvoiceService) {
    suspend fun getListInvoice(): List<InvoiceModel>? = withContext(Dispatchers.IO) {
        val response = api.getListInvoice()
        if (response.isSuccessful) {
            Log.d("InvoiceRepository", "getListInvoice Success: ${response.body()}")
            response.body()
        } else {
            Log.e("InvoiceRepository", "getListInvoice Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addInvoice(Invoice: InvoiceModel): InvoiceModel? = withContext(Dispatchers.IO) {
        val response = api.addInvoice(Invoice)
        if (response.isSuccessful) {
            Log.d("InvoiceRepository", "addInvoice Success: ${response.body()}")
            response.body()
        } else {
            Log.e("InvoiceRepository", "addInvoice Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getInvoiceById(id: String): InvoiceModel? = withContext(Dispatchers.IO) {
        val response = api.getInvoiceById(id)
        if (response.isSuccessful) {
            Log.d("InvoiceRepository", "getInvoiceById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("InvoiceRepository", "getInvoiceById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateInvoice(id: String, Invoice: InvoiceModel): InvoiceModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateInvoice(id, Invoice)
        if (response.isSuccessful) {
            Log.d("InvoiceRepository", "updateInvoice Success: ${response.body()}")
            response.body()
        } else {
            Log.e("InvoiceRepository", "updateInvoice Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteInvoice(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteInvoice(id)
        if (response.isSuccessful) {
            Log.d("InvoiceRepository", "deleteInvoice Success")
            true
        } else {
            Log.e("InvoiceRepository", "deleteInvoice Error: ${response.errorBody()}")
            false
        }
    }
}