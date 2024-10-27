package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class RoleModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("name") var name: String = "",
    @field:SerializedName("description") var description: String = ""
)