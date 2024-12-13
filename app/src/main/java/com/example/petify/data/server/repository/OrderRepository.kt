package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.OrderModel
import com.example.petify.data.server.enitities.OrderModelRequest
import com.example.petify.data.server.service.OrderService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class OrderRepository(private val api: OrderService) {

    suspend fun getListOrder(): List<OrderModel>? = withContext(Dispatchers.IO) {
        val response = api.getListOrder()
        if (response.isSuccessful) {
            Log.d("OrderRepository", "getListOrder Success: ${response.body()}")
            response.body()
        } else {
            Log.e("OrderRepository", "getListOrder Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun addOrder(Order: OrderModelRequest): OrderModel? = withContext(Dispatchers.IO) {
        val response = api.addOrder(Order)
        if (response.isSuccessful) {
            Log.d("OrderRepository", "addOrder Success: ${response.body()}")
            response.body()
        } else {
            Log.e("OrderRepository", "addOrder Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getOrderById(id: String): OrderModel? = withContext(Dispatchers.IO) {
        val response = api.getOrderById(id)
        if (response.isSuccessful) {
            Log.d("OrderRepository", "getOrderById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("OrderRepository", "getOrderById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateOrder(id: String, Order: OrderModel): OrderModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateOrder(id, Order)
        if (response.isSuccessful) {
            Log.d("OrderRepository", "updateOrder Success: ${response.body()}")
            response.body()
        } else {
            Log.e("OrderRepository", "updateOrder Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteOrder(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteOrder(id)
        if (response.isSuccessful) {
            Log.d("OrderRepository", "deleteOrder Success")
            true
        } else {
            Log.e("OrderRepository", "deleteOrder Error: ${response.errorBody()}")
            false
        }
    }
}