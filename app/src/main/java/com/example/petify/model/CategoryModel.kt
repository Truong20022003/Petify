package com.example.petify.model

import android.os.Parcelable
import com.google.gson.annotations.SerializedName


data class CategoryModel(
    @SerializedName("product")
    val product: String?,
    @SerializedName("items")
    val items: List<ProductModel>?
)