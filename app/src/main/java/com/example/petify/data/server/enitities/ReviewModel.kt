package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class ReviewModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("rating") var rating: Int = 0,
    @field:SerializedName("comment") var comment: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("product_id") var productId: String = "",
)

data class ReviewModelRequest(
    @field:SerializedName("rating") var rating: Int = 0,
    @field:SerializedName("comment") var comment: String = "",
    @field:SerializedName("user_id") var user_id: String = "",
    @field:SerializedName("product_id") var product_id: String = "",
)