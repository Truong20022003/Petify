package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.FavoriteRequest
import com.example.petify.data.server.enitities.FavoriteResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface FavoriteService {

    @GET("favorites/getListfavorites")
    suspend fun getListFavorites(): Response<List<FavoriteResponse>>

    @POST("favorites/addTofavorites")
    suspend fun addFavorites(@Body favorites: FavoriteRequest): Response<FavoriteRequest>

    @DELETE("cart/delete/{product_id}/{user_id}")
    suspend fun deleteFavorites(@Path("product_id") product_id: String, @Path("user_id") user_id: String): Response<Unit>// này là ko cần data trả ve

}