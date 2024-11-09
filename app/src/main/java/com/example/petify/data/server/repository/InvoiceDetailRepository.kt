package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.InvoiceDetailModel
import com.example.petify.data.server.service.InvoiceDetailService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class InvoiceDetailRepository( private val api: InvoiceDetailService) {
    suspend fun getListInvoiceDetail(): List<InvoiceDetailModel>? = withContext(Dispatchers.IO) {
        val response = api.getListInvoiceDetail()
        if (response.isSuccessful) {
            Log.d("InvoiceDetailRepository", "getListInvoiceDetail Success: ${response.body()}")
            response.body()
        } else {
            Log.e("InvoiceDetailRepository", "getListInvoiceDetail Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addInvoiceDetail(InvoiceDetail: InvoiceDetailModel): InvoiceDetailModel? = withContext(Dispatchers.IO) {
        val response = api.addInvoiceDetail(InvoiceDetail)
        if (response.isSuccessful) {
            Log.d("InvoiceDetailRepository", "addInvoiceDetail Success: ${response.body()}")
            response.body()
        } else {
            Log.e("InvoiceDetailRepository", "addInvoiceDetail Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getInvoiceDetailById(id: String): InvoiceDetailModel? = withContext(Dispatchers.IO) {
        val response = api.getInvoiceDetailById(id)
        if (response.isSuccessful) {
            Log.d("InvoiceDetailRepository", "getInvoiceDetailById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("InvoiceDetailRepository", "getInvoiceDetailById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateInvoiceDetail(id: String, InvoiceDetail: InvoiceDetailModel): InvoiceDetailModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateInvoiceDetail(id, InvoiceDetail)
        if (response.isSuccessful) {
            Log.d("InvoiceDetailRepository", "updateInvoiceDetail Success: ${response.body()}")
            response.body()
        } else {
            Log.e("InvoiceDetailRepository", "updateInvoiceDetail Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteInvoiceDetail(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteInvoiceDetail(id)
        if (response.isSuccessful) {
            Log.d("InvoiceDetailRepository", "deleteInvoiceDetail Success")
            true
        } else {
            Log.e("InvoiceDetailRepository", "deleteInvoiceDetail Error: ${response.errorBody()}")
            false
        }
    }
}