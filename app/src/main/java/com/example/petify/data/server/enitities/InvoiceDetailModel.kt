package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class InvoiceDetailModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("product_id") var productId: String = "",
    @field:SerializedName("order_id") var orderId: String = "",
    @field:SerializedName("quantity") var quantity: Int = 0,
    @field:SerializedName("total_price") var totalPrice: Double = 0.0
)

data class InvoiceDetailModelRequest(
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("product_id") var productId: String = "",
    @field:SerializedName("order_id") var orderId: String = "",
    @field:SerializedName("quantity") var quantity: Int = 0,
    @field:SerializedName("total_price") var totalPrice: Double = 0.0
)

data class OrderResponse(
    @field:SerializedName("_id") var _id: String = "",
    @field:SerializedName("user_id") var user_id: String = "",
    @field:SerializedName("product") var product_id: ProductModel,
    @field:SerializedName("order_id") var order_id: Orderr,
    @field:SerializedName("quantity") var quantity: Int = 0,
    @field:SerializedName("total_price") var total_price: Double = 0.0,
)
data class Orderr(
    @field:SerializedName("_id") var _id: String = "",
    @field:SerializedName("status") var status: String = ""
)

data class InvoiceDetailAndProductModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("product_id") var productId: ProductModel,
    @field:SerializedName("order_id") var orderId: String = "",
    @field:SerializedName("quantity") var quantity: Int = 0,
    @field:SerializedName("total_price") var totalPrice: Double = 0.0
)