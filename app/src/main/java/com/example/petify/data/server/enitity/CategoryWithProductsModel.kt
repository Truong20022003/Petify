package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class CategoryWithProductsModel(
    @SerializedName("_id") var id: String = "",
    @SerializedName("category_name") var category_name: String = "",
    @SerializedName("product") var products: List<ProductModel> = listOf()

)
