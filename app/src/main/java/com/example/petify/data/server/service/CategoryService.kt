package com.example.petify.data.server.service

import com.example.petify.data.server.enitity.CategoryModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface CategoryService {
    @GET("category/getListCategory")
    suspend fun getListCategory(): Response<List<CategoryModel>>

    @POST("category/addcategory")
    suspend fun addCategory(@Body Category: CategoryModel): Response<CategoryModel>

    @GET("category/getcategoryById/{id}")
    suspend fun getCategoryById(@Path("id") id: String): Response<CategoryModel>

    @PUT("category/updatecategory/{id}")
    suspend fun updateCategory(
        @Path("id") id: String,
        @Body Category: CategoryModel
    ): Response<CategoryModel>

    @DELETE("category/deletecategory/{id}")
    suspend fun deleteCategory(@Path("id") id: String): Response<Unit>
}