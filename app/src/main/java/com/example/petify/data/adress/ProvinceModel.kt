package com.example.petify.data.adress

import com.google.gson.annotations.SerializedName

data class ProvinceResponse(
    @field:SerializedName("code") var code: Int = 0,
    @field:SerializedName("message") var message: String = "",
    @field:SerializedName("data") var data: List<ProvinceModel>
)



data class ProvinceModel(
    @field:SerializedName("ProvinceID") var id: String = "",
    @field:SerializedName("ProvinceName") var ProvinceName: String = "",
)