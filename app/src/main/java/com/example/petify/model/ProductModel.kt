package com.example.petify.model

import android.os.Parcelable
import com.google.gson.annotations.SerializedName

data class ProductModel(
    @SerializedName("id")
    val id: String,
    @SerializedName("supplierId")
    val supplierId: String,
    @SerializedName("price")
    val price: Int,
    @SerializedName("date")
    val date: String,
    @SerializedName("expiryDate")
    val expiryDate: String,
    @SerializedName("quantity")
    val quantity: Int,
    @SerializedName("name")
    val name: String,
    @SerializedName("image")
    val image: List<String>,
    @SerializedName("status")
    val status: String,
    @SerializedName("description")
    val description: String,
    @SerializedName("sale")
    val sale: Int
)

