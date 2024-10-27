package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitity.CarrierModel
import com.example.petify.data.server.service.CarrierService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CarrierRepository(private val api: CarrierService) {

    suspend fun getListCarrier(): List<CarrierModel>? = withContext(Dispatchers.IO) {
        val response = api.getListCarrier()
        if (response.isSuccessful) {
            Log.d("CarrierRepository", "getListCarrier Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CarrierRepository", "getListCarrier Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addCarrier(carrier: CarrierModel): CarrierModel? = withContext(Dispatchers.IO) {
        val response = api.addCarrier(carrier)
        if (response.isSuccessful) {
            Log.d("CarrierRepository", "addCarrier Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CarrierRepository", "addCarrier Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getCarrierById(id: String): CarrierModel? = withContext(Dispatchers.IO) {
        val response = api.getCarrierById(id)
        if (response.isSuccessful) {
            Log.d("CarrierRepository", "getCarrierById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CarrierRepository", "getCarrierById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateCarrier(id: String, carrier: CarrierModel): CarrierModel? = withContext(Dispatchers.IO) {
        val response = api.updateCarrier(id, carrier)
        if (response.isSuccessful) {
            Log.d("CarrierRepository", "updateCarrier Success: ${response.body()}")
            response.body()
        } else {
            Log.e("CarrierRepository", "updateCarrier Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteCarrier(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteCarrier(id)
        if (response.isSuccessful) {
            Log.d("CarrierRepository", "deleteCarrier Success")
            true
        } else {
            Log.e("CarrierRepository", "deleteCarrier Error: ${response.errorBody()}")
            false
        }
    }
}
