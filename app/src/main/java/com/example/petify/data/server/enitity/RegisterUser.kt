package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class RegisterUser(
    @field:SerializedName("name") val name: String,
    @field:SerializedName("email") val email: String,
    @field:SerializedName("password") val password: String
)
