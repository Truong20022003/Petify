package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    @field:SerializedName("login") val email: String,
    @field:SerializedName("password") val password: String
)