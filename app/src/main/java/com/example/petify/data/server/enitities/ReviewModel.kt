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


data class ReviewResponse(
    @field:SerializedName("status") var status: String = "",
    @field:SerializedName("result") var result: List<ReviewModelResult>
)
data class ReviewModelResult(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("rating") var rating: Int = 0,
    @field:SerializedName("comment") var comment: String = "",
    @field:SerializedName("user_id") var user_id: UserProductReview,
    @field:SerializedName("product_id") var product_id: String = "",
)
data class UserProductReview(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("name") var name: String = "",
    @field:SerializedName("avata") var avata: String = ""
)

