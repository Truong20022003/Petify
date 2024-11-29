package com.example.petify.data.adress

import com.google.gson.annotations.SerializedName



data class DistrictRequest(
    @field:SerializedName("province_id") var provinceId: Int = 0
)


data class DistrictResponse(
    @field:SerializedName("code") var code: Int = 0,
    @field:SerializedName("message") var message: String = "",
    @field:SerializedName("data") var data: List<DistrictModel>
)


data class DistrictModel(

    @field:SerializedName("DistrictID") var id: String = "",
    @field:SerializedName("ProvinceID") var ProvinceID: String = "",
    @field:SerializedName("DistrictName") var DistrictName: String = "",
)