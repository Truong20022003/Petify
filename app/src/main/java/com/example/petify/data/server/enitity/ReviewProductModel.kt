package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class ReviewProductModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("review_id") var reviewId: String = "",
    @field:SerializedName("product_id") var productId: String = "",
)