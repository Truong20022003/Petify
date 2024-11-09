package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class ProductModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("supplier_id") var supplierId: String = "",
    @field:SerializedName("price") var price: Int = 0,
    @field:SerializedName("date") var date: String = "",
    @field:SerializedName("expiry_Date") var expiryDate: String = "",
    @field:SerializedName("quantity") var quantity: Int = 0,
    @field:SerializedName("name") var name: String = "",
    @field:SerializedName("image") var image: List<String> = listOf(),
    @field:SerializedName("status") var status: String = "",
    @field:SerializedName("description") var description: String = "",
    @field:SerializedName("sale") var sale: Int = 0,
)