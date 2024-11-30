package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class LoginResponse (
    @field:SerializedName("status") val status: String,
    @field:SerializedName("token") val token: String,
    @field:SerializedName("user") val user: UserModel
)