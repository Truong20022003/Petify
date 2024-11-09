package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.SupplierModel
import com.example.petify.data.server.service.SupplierService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class SupplierRepository(private val api: SupplierService) {
    suspend fun getListSupplier(): List<SupplierModel>? = withContext(Dispatchers.IO) {
        val response = api.getListSupplier()
        if (response.isSuccessful) {
            Log.d("SupplierRepository", "getListSupplier Success: ${response.body()}")
            response.body()
        } else {
            Log.e("SupplierRepository", "getListSupplier Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addSupplier(Supplier: SupplierModel): SupplierModel? = withContext(Dispatchers.IO) {
        val response = api.addSupplier(Supplier)
        if (response.isSuccessful) {
            Log.d("SupplierRepository", "addSupplier Success: ${response.body()}")
            response.body()
        } else {
            Log.e("SupplierRepository", "addSupplier Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getSupplierById(id: String): SupplierModel? = withContext(Dispatchers.IO) {
        val response = api.getSupplierById(id)
        if (response.isSuccessful) {
            Log.d("SupplierRepository", "getSupplierById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("SupplierRepository", "getSupplierById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateSupplier(id: String, Supplier: SupplierModel): SupplierModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateSupplier(id, Supplier)
        if (response.isSuccessful) {
            Log.d("SupplierRepository", "updateSupplier Success: ${response.body()}")
            response.body()
        } else {
            Log.e("SupplierRepository", "updateSupplier Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteSupplier(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteSupplier(id)
        if (response.isSuccessful) {
            Log.d("SupplierRepository", "deleteSupplier Success")
            true
        } else {
            Log.e("SupplierRepository", "deleteSupplier Error: ${response.errorBody()}")
            false
        }
    }
}