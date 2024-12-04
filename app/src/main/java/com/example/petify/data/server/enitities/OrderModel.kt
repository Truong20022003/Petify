package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class OrderModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("oder_date") var oderDate: String = "",
    @field:SerializedName("total_price") var totalPrice: Double = 0.0,
    @field:SerializedName("status") var status: String = "",
    @field:SerializedName("payment_method") var paymentMethod: String = "",
    @field:SerializedName("delivery_address") var deliveryAddress: String = "",
    @field:SerializedName("shipping_fee") var shippingFee: Double = 0.0,
    @field:SerializedName("carrier_id") var carrierId: String = "",
    @field:SerializedName("code") var code: String = ""
): Serializable