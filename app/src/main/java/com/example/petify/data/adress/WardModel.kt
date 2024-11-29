package com.example.petify.data.adress

import com.google.gson.annotations.SerializedName

data class WardRequest(
    @field:SerializedName("district_id") var districtId: Int = 0
)

data class WardResponse(
    @field:SerializedName("code") var code: Int = 0,
    @field:SerializedName("message") var message: String = "",
    @field:SerializedName("data") var data: List<WardModel>
)

data class WardModel (

    @field:SerializedName("WardCode") var id: String = "",
    @field:SerializedName("DistrictID") var DistrictID: String = "",
    @field:SerializedName("WardName") var WardName: String = "",
)