package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class InvoiceDetailModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("product_id") var productId: String = "",
    @field:SerializedName("quantity") var quantity: Int = 0,
    @field:SerializedName("total_price") var totalPrice: Double = 0.0
)