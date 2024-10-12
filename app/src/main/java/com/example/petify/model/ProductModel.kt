package com.example.petify.model

import android.os.Parcelable
import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

//data class ProductModel(
//    val id: String,
//    val supplierId: String,
//    val price: Int,
//    val date: String,
//    val expiryDate: String,
//    val quantity: Int,
//    val name: String,
//    val image: List<Int>,
//    val status: String,
//    val description: String,
//    val sale: Int
//)



@Parcelize
@Keep
data class ProductModel(
    @SerializedName("product")
    val product: String?, // Tên loại sản phẩm
    @SerializedName("items")
    val items: List<ProductItem>? // Danh sách mặt hàng sản phẩm
) : Parcelable

@Parcelize
@Keep
data class ProductItem(
    @SerializedName("id")
    val id: String,  // Mã sản phẩm
    @SerializedName("supplierId")
    val supplierId: String,  // Mã nhà cung cấp
    @SerializedName("price")
    val price: Int,  // Giá sản phẩm
    @SerializedName("date")
    val date: String,  // Ngày nhập hàng
    @SerializedName("expiryDate")
    val expiryDate: String,  // Ngày hết hạn
    @SerializedName("quantity")
    val quantity: Int,  // Số lượng
    @SerializedName("name")
    val name: String,  // Tên sản phẩm
    @SerializedName("image")
    val image: List<Int>,  // Danh sách hình ảnh (ID hoặc URL)
    @SerializedName("status")
    val status: String,  // Trạng thái sản phẩm
    @SerializedName("description")
    val description: String,  // Mô tả sản phẩm
    @SerializedName("sale")
    val sale: Int // Giảm giá
) : Parcelable
