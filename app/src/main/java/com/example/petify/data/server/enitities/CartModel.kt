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

data class CartResponseAndStatus(
    @field:SerializedName("status") var status: String = "",
    @field:SerializedName("data") var data: CartRequest
)

@Parcelize
data class CartResponse(
    @field:SerializedName("_id") var id: String = "",
    @field:SerializedName("user_id") var userId: String = "",
    @field:SerializedName("product_id") var productId: ProductModel,
    @field:SerializedName("quantity") var quantity: Int = 0
) : Parcelable{
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is CartResponse) return false
        return id == other.id
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}

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