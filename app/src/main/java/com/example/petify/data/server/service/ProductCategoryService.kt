package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.ProductCategoryModel
import com.example.petify.data.server.enitities.ResponeCategoryProduct
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ProductCategoryService {
    @GET("productCategory/getListOroductCategory")
    suspend fun getListProductCategory(): Response<List<ProductCategoryModel>>

    @POST("productCategory/addproduct_category")
    suspend fun addProductCategory(@Body ProductCategory: ProductCategoryModel): Response<ProductCategoryModel>

    @GET("productCategory/getproduct_categoryById/{id}")
    suspend fun getProductCategoryById(@Path("id") id: String): Response<ProductCategoryModel>

    @PUT("productCategory/updateproduct_category/{id}")
    suspend fun updateProductCategory(
        @Path("id") id: String,
        @Body ProductCategory: ProductCategoryModel
    ): Response<ProductCategoryModel>

    @DELETE("productCategory/deleteproduct_category/{id}")
    suspend fun deleteProductCategory(@Path("id") id: String): Response<Unit>


    @GET("productCategory/getProductsGroupedByCategory")
    suspend fun getProductsGroupedByCategory(): Response<ResponeCategoryProduct>

}