package com.example.petify.data.server.enitities

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize
import java.io.Serializable


data class CartRequest(
//    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("product_id") var productId: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("quantity") var quantity: Int = 0,
)
@Parcelize
data class CartResponse(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("product_id") var productId: ProductModel,
    @field:SerializedName("quantity") var quantity: Int = 0
) : Parcelable
data class FavoriteRequest(
//    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("product_id") var productId: String = "",
    @field:SerializedName("user_id") var userId: String = ""
)

@Parcelize
data class FavoriteResponse(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("product_id") var productId: ProductModel
): Parcelable