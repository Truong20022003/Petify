package com.example.petify.ui.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.model.ProductItem
import com.example.petify.model.ProductModel

class ViewHomeModel : BaseViewModel() {

    private val _images = MutableLiveData<List<Int>>()
    val images: LiveData<List<Int>> get() = _images

    private val _productModels = MutableLiveData<List<ProductModel>>()
    val productModels: LiveData<List<ProductModel>> get() = _productModels

    init {
        _images.value = listOf(R.drawable.img_slide1, R.drawable.img_slide2, R.drawable.img_slide3, R.drawable.img_slide2)

        val productItems = listOf(
            ProductItem(
                id = "1",
                supplierId = "sup1",
                price = 200000,
                date = "2024-10-01",
                expiryDate = "2025-10-01",
                quantity = 100,
                name = "Sản phẩm A",
                image = listOf(R.drawable.img_item_sp1, R.drawable.img_slide2),
                status = "Còn hàng",
                description = "Mô tả chi tiết cho sản phẩm A",
                sale = 10 // Giảm giá 10%
            ),
            ProductItem(
                id = "2",
                supplierId = "sup2",
                price = 150000,
                date = "2024-10-05",
                expiryDate = "2025-10-05",
                quantity = 50,
                name = "Sản phẩm B",
                image = listOf(R.drawable.img_item_sp1),
                status = "Còn hàng",
                description = "Mô tả chi tiết cho sản phẩm B",
                sale = 5 // Giảm giá 5%
            ),
            ProductItem(
                id = "3",
                supplierId = "sup3",
                price = 300000,
                date = "2024-10-07",
                expiryDate = "2025-10-07",
                quantity = 0,
                name = "Sản phẩm C",
                image = listOf(R.drawable.img_item_sp1),
                status = "Hết hàng",
                description = "Mô tả chi tiết cho sản phẩm C",
                sale = 0 // Không có giảm giá
            )
        )

        _productModels.value = listOf(
            ProductModel(
                product = "Loại sản phẩm 1",
                items = productItems
            ),
            ProductModel(
                product = "Loại sản phẩm 2",
                items = productItems
            )
        )
    }
}
