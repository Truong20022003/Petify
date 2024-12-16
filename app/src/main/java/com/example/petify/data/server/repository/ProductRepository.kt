package com.example.petify.data.server.repository

import android.util.Log
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.data.server.enitities.ProductModelSaleNew
import com.example.petify.data.server.enitities.SuccessResponse
import com.example.petify.data.server.enitities.UpdateQuantity
import com.example.petify.data.server.service.ProductService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ProductRepository(private val api: ProductService) {

    suspend fun getListProduct(): List<ProductModel>? = withContext(Dispatchers.IO) {
        val response = api.getListProduct()
        if (response.isSuccessful) {
            Log.d("ProductRepository", "getListProduct Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductRepository", "getListProduct Error: ${response.errorBody()}")
            null
        }
    }
    suspend fun getLatestSaleUpdatedProduct(): ProductModelSaleNew? = withContext(Dispatchers.IO) {
        val response = api.getLatestSaleUpdatedProduct()
        if (response.isSuccessful) {
            Log.d("ProductRepository", "getLatestSaleUpdatedProduct Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductRepository", "getLatestSaleUpdatedProduct Error: ${response.errorBody()}")
            null
        }
    }
    suspend fun addProduct(Product: ProductModel): ProductModel? = withContext(Dispatchers.IO) {
        val response = api.addProduct(Product)
        if (response.isSuccessful) {
            Log.d("ProductRepository", "addProduct Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductRepository", "addProduct Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun getProductById(id: String): ProductModel? = withContext(Dispatchers.IO) {
        val response = api.getProductById(id)
        if (response.isSuccessful) {
            Log.d("ProductRepository", "getProductById Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductRepository", "getProductById Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun updateProduct(id: String, Product: ProductModel): ProductModel? = withContext(
        Dispatchers.IO) {
        val response = api.updateProduct(id, Product)
        if (response.isSuccessful) {
            Log.d("ProductRepository", "updateProduct Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductRepository", "updateProduct Error: ${response.errorBody()}")
            null
        }
    }
    suspend fun updateQuantity(id: String, product: UpdateQuantity): SuccessResponse? = withContext(
        Dispatchers.IO) {
        val response = api.updateQuantity(id, product)
        if (response.isSuccessful) {
            Log.d("ProductRepository", "updateProduct Success: ${response.body()}")
            response.body()
        } else {
            Log.e("ProductRepository", "updateProduct Error: ${response.errorBody()}")
            null
        }
    }

    suspend fun deleteProduct(id: String): Boolean = withContext(Dispatchers.IO) {
        val response = api.deleteProduct(id)
        if (response.isSuccessful) {
            Log.d("ProductRepository", "deleteProduct Success")
            true
        } else {
            Log.e("ProductRepository", "deleteProduct Error: ${response.errorBody()}")
            false
        }
    }
}