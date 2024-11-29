package com.example.petify.data.adress

import retrofit2.Response

class AddressRepository(private val service: AdressService) {

    suspend fun getProvinces(): Response<ProvinceResponse> {
        return service.getListProvince()
    }

    suspend fun getDistricts(provinceId: Int): Response<DistrictResponse> {
        val requestBody = DistrictRequest(provinceId = provinceId)
        return service.getListDistrict(requestBody)
    }

    suspend fun getWards(districtId: Int): Response<WardResponse> {
        val requestBody = WardRequest(districtId = districtId)
        return service.getListWard(requestBody)
    }
}