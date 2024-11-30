package com.example.petify.data.adress

data class ShippingFeeRequest(
    val from_district_id: Int,
    val service_id: Int,
    val to_district_id: Int,
    val to_ward_code: String,
    val weight: Int
)

data class ShippingFeeResponse(
    val code: Int,
    val message: String,
    val data: ShippingFeeData
)

data class ShippingFeeData(
    val total: Int // Tổng tiền vận chuyển
)