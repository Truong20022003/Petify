package com.example.petify.data.server.service

import com.example.petify.data.server.enitity.CarrierModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface CarrierService {
    @GET("carrier/getListCarier")
    suspend fun getListCarrier(): Response<List<CarrierModel>>

    @POST("carrier/addCarrier")
    suspend fun addCarrier(@Body Carrier: CarrierModel): Response<CarrierModel>

    @GET("carrier/getCarrierById/{id}")
    suspend fun getCarrierById(@Path("id") id: String): Response<CarrierModel>

    @PUT("carrier/updateCarrier/{id}")
    suspend fun updateCarrier(
        @Path("id") id: String,
        @Body Carrier: CarrierModel
    ): Response<CarrierModel>

    @DELETE("carrier/deleteCarrier/{id}")
    suspend fun deleteCarrier(@Path("id") id: String): Response<Unit>// này là ko cần data trả ve
}