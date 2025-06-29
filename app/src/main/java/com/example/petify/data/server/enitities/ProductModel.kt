package com.example.petify.data.server.enitities

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class ProductModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("supplier_id") var supplierId: String = "",
    @field:SerializedName("price") var price: Double = 0.0,
    @field:SerializedName("date") var date: String = "",
    @field:SerializedName("expiry_Date") var expiryDate: String = "",
    @field:SerializedName("quantity") var quantity: Int = 0,
    @field:SerializedName("name") var name: String = "",
    @field:SerializedName("image") var image: List<String> = listOf(),
    @field:SerializedName("status") var status: String = "",
    @field:SerializedName("description") var description: String = "",
    @field:SerializedName("sale") var sale: Int = 0,
) : Parcelable

data class ProductModelSaleNew(
    @field:SerializedName("success") val success: Boolean,
    @field:SerializedName("message") val message: String,
    @field:SerializedName("product") val product: ProductModel
)

data class UpdateQuantity(
    @field:SerializedName("quantity") val quantity: Int
)

