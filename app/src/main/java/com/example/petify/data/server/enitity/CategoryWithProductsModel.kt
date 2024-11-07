package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class CategoryWithProductsModel(
    @SerializedName("_id") var id: String = "",
    @SerializedName("product") var products: List<List<ProductModel>> = listOf()

)
