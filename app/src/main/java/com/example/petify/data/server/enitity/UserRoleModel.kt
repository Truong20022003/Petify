package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class UserRoleModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("role_id") var roleId: String = ""
)