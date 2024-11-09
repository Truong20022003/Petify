package com.example.petify.data.database.enitities

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

@Entity(tableName = "cart_items")
data class CartItem(
    @PrimaryKey @SerializedName("_id") val id: String,
    @SerializedName("supplier_id") val supplierId: String,
    @SerializedName("price") val price: Int,
    @SerializedName("date") val date: String,
    @SerializedName("expiry_Date") val expiryDate: String,
    @SerializedName("quantity") var quantity: Int,
    @SerializedName("name") val name: String,
    @SerializedName("image") val image: List<String> = listOf(),
    @SerializedName("status") val status: String,
    @SerializedName("description") val description: String,
    @SerializedName("sale") val sale: Int
)
