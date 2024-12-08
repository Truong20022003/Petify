package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class RegisterUser(
    @field:SerializedName("name") val name: String,
    @field:SerializedName("email") val email: String,
    @field:SerializedName("password") val password: String,
    @field:SerializedName("phone_number") val phoneNumber: String
)

data class RegisterUserResponse(
    @field:SerializedName("id") val id: String,
    @field:SerializedName("name") val name: String,
    @field:SerializedName("email") val email: String,
    @field:SerializedName("password") val password: String,
    @field:SerializedName("phone_number") val phoneNumber: String
)
data class RegisterResponse(
    @field:SerializedName("status") val status: String,
    @field:SerializedName("message") val message: String,
    @field:SerializedName("result") val result: RegisterUserResponse
)

