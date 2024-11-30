package com.example.petify.data.adress

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface AdressService {
    @GET("province")
    suspend fun getListProvince(): Response<ProvinceResponse>

    @POST("district")
    suspend fun getListDistrict(@Body request: DistrictRequest): Response<DistrictResponse>

    @POST("ward")
    suspend fun getListWard(@Body request: WardRequest): Response<WardResponse>

    @POST("v2/shipping-order/fee")
    suspend fun calculateShippingFee(@Body request: ShippingFeeRequest): Response<ShippingFeeResponse>

}