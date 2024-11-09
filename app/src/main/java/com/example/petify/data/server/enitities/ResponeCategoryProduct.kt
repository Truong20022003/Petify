package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class ResponeCategoryProduct (
    @SerializedName("status") var status: String = "",
    @SerializedName("result") var result: List<CategoryWithProductsModel> = listOf()
)