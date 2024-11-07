package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class ResponeCategoryProduct (
    @SerializedName("status") var status: String = "",
    @SerializedName("result") var result: List<CategoryWithProductsModel> = listOf()
)