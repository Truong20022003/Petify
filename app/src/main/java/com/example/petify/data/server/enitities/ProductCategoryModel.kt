package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class ProductCategoryModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("product_id") var productId: String = "",
    @field:SerializedName("category_id") var categoryId: String = ""
)