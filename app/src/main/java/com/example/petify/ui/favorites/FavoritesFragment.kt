package com.example.petify.ui.favorites

import android.content.Intent
import android.view.View
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseFragment
import com.example.petify.databinding.FragmentFavoritesBinding
import com.example.petify.model.ProductModel
import com.example.petify.ui.home.MenuProductAdapter
import com.example.petify.ui.productdetail.ProductDetailActivity


class FavoritesFragment : BaseFragment<FragmentFavoritesBinding>() {

    private lateinit var adapter: FavoritesAdapter
    private lateinit var menuAdapter: MenuProductAdapter // Adapter cho menu
    private val favoriteProducts = mutableListOf<ProductModel>()

    override fun inflateViewBinding() = FragmentFavoritesBinding.inflate(layoutInflater)

    // Dữ liệu mẫu cho danh sách menu
    private val menuItems = listOf("All", "Settings", "Profile", "Logout")

    val ListProduct = listOf(
        ProductModel(
            id = "1",
            supplierId = "sup1",
            price = 200000,
            date = "2024-10-01",
            expiryDate = "2025-10-01",
            quantity = 100,
            name = "Sản phẩm A",
            image = listOf(
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg",
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg"
            ),
            status = "Còn hàng",
            description = "Mô tả chi tiết cho sản phẩm A",
            sale = 10 // Giảm giá 10%
        ),
        ProductModel(
            id = "2",
            supplierId = "sup2",
            price = 150000,
            date = "2024-10-05",
            expiryDate = "2025-10-05",
            quantity = 50,
            name = "Sản phẩm B",
            image = listOf(
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg",
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg"
            ),
            status = "Còn hàng",
            description = "Mô tả chi tiết cho sản phẩm B",
            sale = 5 // Giảm giá 5%
        ),
        ProductModel(
            id = "3",
            supplierId = "sup3",
            price = 300000,
            date = "2024-10-07",
            expiryDate = "2025-10-07",
            quantity = 0,
            name = "Sản phẩm C",
            image = listOf(
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg",
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg"
            ),
            status = "Hết hàng",
            description = "Mô tả chi tiết cho sản phẩm C",
            sale = 0 // Không có giảm giá
        ),
        ProductModel(
            id = "3",
            supplierId = "sup3",
            price = 300000,
            date = "2024-10-07",
            expiryDate = "2025-10-07",
            quantity = 0,
            name = "Sản phẩm C",
            image = listOf(
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg",
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg"
            ),
            status = "Hết hàng",
            description = "Mô tả chi tiết cho sản phẩm C",
            sale = 0 // Không có giảm giá
        ),
        ProductModel(
            id = "3",
            supplierId = "sup3",
            price = 300000,
            date = "2024-10-07",
            expiryDate = "2025-10-07",
            quantity = 0,
            name = "Sản phẩm C",
            image = listOf(
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg",
                "https://kinpetshop.com/wp-content/uploads/thuc-an-hat-cho-meo-kit-cat-kitten-pregnant-cat-1-2kg.jpg"
            ),
            status = "Hết hàng",
            description = "Mô tả chi tiết cho sản phẩm C",
            sale = 0 // Không có giảm giá
        )
    )


    override fun initView() {
        super.initView()

        // Thiết lập RecyclerView cho menu
        viewBinding.rcvMenu.layoutManager =
            LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
        menuAdapter = MenuProductAdapter(menuItems)
        viewBinding.rcvMenu.adapter = menuAdapter

        // Thiết lập RecyclerView cho sản phẩm
        viewBinding.rcvFragment.layoutManager = GridLayoutManager(context, 2)
//        adapter = ProductAdapter(ListProduct) { productModel ->
//            val intent = Intent(context, ProductDetailActivity::class.java).apply {
//                putExtra("PRODUCT_ITEM", productModel)
//            }
//            startActivity(intent)
//        }


        // Set up ProductAdapter with favorite change callback
        adapter = FavoritesAdapter(ListProduct, { product ->
            // Handle product click if needed
            val intent = Intent(context, ProductDetailActivity::class.java).apply {
//                putExtra("PRODUCT_ITEM", product)
            }
            startActivity(intent)
        }, { product, isFavorite ->
            // Update favorite products list based on selection
            if (isFavorite) {
                favoriteProducts.add(product)
            } else {
                favoriteProducts.remove(product)
            }
        })
        viewBinding.rcvFragment.adapter = adapter

        // Kiểm tra nếu danh sách yêu thích trống
        if (ListProduct.isEmpty()) {
            viewBinding.tvEmptyFavorites.visibility = View.VISIBLE
        } else {
            viewBinding.tvEmptyFavorites.visibility = View.GONE
        }

    }


}