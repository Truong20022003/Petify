package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class OrderModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("oder_date") var oderDate: String = "",
    @field:SerializedName("total_price") var totalPrice: Double = 0.0,
    @field:SerializedName("status") var status: String = "",
)