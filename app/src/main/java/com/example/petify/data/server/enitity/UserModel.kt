package com.example.petify.data.server.enitity

import com.google.gson.annotations.SerializedName

data class UserModel(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("name") var name: String = "",
    @field:SerializedName("email") var email: String = "",
    @field:SerializedName("phone_number") var phoneNumber: String = "",
    @field:SerializedName("password") var password: String = "",
    @field:SerializedName("user_name") var user_name: String = "",
    @field:SerializedName("location") var location: String = "",
    @field:SerializedName("avata") var avata: String = ""
)