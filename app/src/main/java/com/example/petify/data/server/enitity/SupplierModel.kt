package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class SupplierModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("name") var name: String = ""
)