//package com.example.petify.ui.home
//
//import ProductModel
//import androidx.lifecycle.LiveData
//import androidx.lifecycle.MutableLiveData
//import com.example.petify.BaseViewModel
//import com.example.petify.R
//import com.example.petify.model.CategoryModel
//
//class ViewHomeModel : BaseViewModel() {
//
//    val _images = MutableLiveData<List<Int>>()
//    val images: LiveData<List<Int>> get() = _images
//
//    var _categoryModel = MutableLiveData<List<CategoryModel>>()
//    val categoryModel: LiveData<List<CategoryModel>> get() = _categoryModel
//
//    val _productModels = MutableLiveData<List<ProductModel>>()
//    val productModels: LiveData<List<ProductModel>> get() = _productModels
//
//
//
//    init {
//        _images.value = listOf(R.drawable.img_slide1, R.drawable.img_slide2, R.drawable.img_slide3, R.drawable.img_slide2)
//
//        val productItems = listOf(
//            ProductModel(
//                id = "1",
//                supplierId = "sup1",
//                price = 200000,
//                date = "2024-10-01",
//                expiryDate = "2025-10-01",
//                quantity = 100,
//                name = "Sản phẩm A",
//                image = listOf("https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-ly6frqq47o0d81.webp", "https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-ly6frqvxz51p3a.webp"),
//                status = "Còn hàng",
//                description = "Mô tả chi tiết cho sản phẩm A",
//                sale = 10 // Giảm giá 10%
//            ),
//            ProductModel(
//                id = "2",
//                supplierId = "sup2",
//                price = 150000,
//                date = "2024-10-05",
//                expiryDate = "2025-10-05",
//                quantity = 50,
//                name = "Sản phẩm B",
//                image = listOf("https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1521m7r2ooq4e.webp"," https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-ly6frzwashpd31.webp"),
//                status = "Còn hàng",
//                description = "Mô tả chi tiết cho sản phẩm B",
//                sale = 5 // Giảm giá 5%
//            ),
//            ProductModel(
//                id = "3",
//                supplierId = "sup3",
//                price = 300000,
//                date = "2024-10-07",
//                expiryDate = "2025-10-07",
//                quantity = 0,
//                name = "Sản phẩm C",
//                image = listOf("https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-ly6frmle9avh83.webp"," https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-ly6frmri0dk125.webp"),
//                status = "Hết hàng",
//                description = "Mô tả chi tiết cho sản phẩm C",
//                sale = 0 // Không có giảm giá
//            )
//        )
//
//        _categoryModel.value = listOf(
//            CategoryModel(
//                product = "Loại sản phẩm 1",
//                items = listOf(productItems[0], productItems[1])
//            ),
//            CategoryModel(
//                product = "Loại sản phẩm 2",
//                items = listOf(productItems[0], productItems[1])
//            )
//        )
//    }
//}
