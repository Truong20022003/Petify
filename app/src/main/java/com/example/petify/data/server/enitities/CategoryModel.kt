package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class CategoryModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("name") var name: String = "",
    @field:SerializedName("image") var phone: String = ""
)