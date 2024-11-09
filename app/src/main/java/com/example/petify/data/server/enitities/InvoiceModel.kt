package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class InvoiceModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("total") var total: Double = 0.0,
    @field:SerializedName("date") var date: String = "",
    @field:SerializedName("status") var status: String = "",
    @field:SerializedName("payment_method") var paymentMethod: String = "",
    @field:SerializedName("delivery_address") var deliveryAddress: String = "",
    @field:SerializedName("shipping_fee") var shippingFee: Double = 0.0,
    @field:SerializedName("supplier_id") var supplierId: String = "",
    @field:SerializedName("carrier_id") var carrierId: String = "",
    @field:SerializedName("order_id") var orderId: String = "",
    @field:SerializedName("create_at") var createAt : String = ""
)