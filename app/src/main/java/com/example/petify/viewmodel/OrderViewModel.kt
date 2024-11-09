package com.example.petify.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import com.example.petify.data.server.enitities.OrderModel
import com.example.petify.data.server.repository.OrderRepository
import kotlinx.coroutines.launch

class OrderViewModel : BaseViewModel() {
    private val _orderList = MutableLiveData<List<OrderModel>?>()
    val orderList: LiveData<List<OrderModel>?> get() = _orderList

    private val _order = MutableLiveData<OrderModel?>()
    val order: LiveData<OrderModel?> get() = _order

    private val _isOrderAdded = MutableLiveData<Boolean>()
    val isOrderAdded: LiveData<Boolean> get() = _isOrderAdded

    private val _isOrderUpdated = MutableLiveData<Boolean>()
    val isOrderUpdated: LiveData<Boolean> get() = _isOrderUpdated

    private val _isOrderDeleted = MutableLiveData<Boolean>()
    val isOrderDeleted: LiveData<Boolean> get() = _isOrderDeleted

    fun getOrders() {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createOrder()
                val orderRepository = OrderRepository(apiService)
                val result = orderRepository.getListOrder()
                _orderList.value = result
            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error geting orders", e)
                _orderList.value = null
            }
        }
    }

    fun addOrder(order: OrderModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createOrder()
                val orderRepository = OrderRepository(apiService)
                val result = orderRepository.addOrder(order)
                _order.value = result
                _isOrderAdded.value = result != null
            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error adding order", e)
                _isOrderAdded.value = false
            }
        }
    }

    fun getOrderById(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createOrder()
                val orderRepository = OrderRepository(apiService)
                val result = orderRepository.getOrderById(id)
                _order.value = result
            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error geting order by ID", e)
                _order.value = null
            }
        }
    }

    fun updateOrder(id: String, order: OrderModel) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createOrder()
                val orderRepository = OrderRepository(apiService)
                val result = orderRepository.updateOrder(id, order)
                _order.value = result
                _isOrderUpdated.value = result != null
            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error updating order", e)
                _isOrderUpdated.value = false
            }
        }
    }

    fun deleteOrder(id: String) {
        viewModelScope.launch {
            try {
                val apiService = CreateInteface.createOrder()
                val orderRepository = OrderRepository(apiService)
                val isDeleted = orderRepository.deleteOrder(id)
                _isOrderDeleted.value = isDeleted
            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error deleting order", e)
                _isOrderDeleted.value = false
            }
        }
    }
}