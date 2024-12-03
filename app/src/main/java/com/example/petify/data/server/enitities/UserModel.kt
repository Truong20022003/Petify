package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

data class UserModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("name") var name: String = "",
    @field:SerializedName("email") var email: String = "",
    @field:SerializedName("phone_number") var phoneNumber: String = "",
    @field:SerializedName("password") var password: String = "",
    @field:SerializedName("user_name") var user_name: String = "",
    @field:SerializedName("location") var location: String = "",
    @field:SerializedName("avata") var avata: String = "",
)
data class UpdateResponse(
    @field:SerializedName("status") val status: String,
    @field:SerializedName("message") val message: String,
    @field:SerializedName("result") val result: UserModel
)
data class ChangePasswordRequest(
    @field:SerializedName("phone_number") val phone_number: String,
    @field:SerializedName("newPassword") val newPassword: String
)
