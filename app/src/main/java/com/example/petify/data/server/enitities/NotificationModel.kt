package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class NotificationModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("order_date") var orderDate: String = "",
    @field:SerializedName("total_price") var totalPrice: String = "",
    @field:SerializedName("status") var status: String = "",
)