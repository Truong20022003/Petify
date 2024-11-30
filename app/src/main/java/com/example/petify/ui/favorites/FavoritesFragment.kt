package com.example.petify.ui.favorites

import android.content.Intent
import android.view.View
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseFragment
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.FragmentFavoritesBinding
import com.example.petify.ui.home.MenuProductAdapter
import com.example.petify.ui.productdetail.ProductDetailActivity


class FavoritesFragment : BaseFragment<FragmentFavoritesBinding>() {

//    private lateinit var adapter: FavoritesAdapter
//    private lateinit var menuAdapter: MenuProductAdapter // Adapter cho menu
//    private val favoriteProducts = mutableListOf<ProductModel>()

    override fun inflateViewBinding() = FragmentFavoritesBinding.inflate(layoutInflater)

    // Dữ liệu mẫu cho danh sách menu
    private val menuItems = listOf("All", "Settings", "Profile", "Logout")

    val ListProduct = listOf(
        ProductModel(
         "","",0.0,"","",0,"",listOf(),"","",0
        )
    )


    override fun initView() {
        super.initView()

//        // Thiết lập RecyclerView cho menu
//        viewBinding.rcvMenu.layoutManager =
//            LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
//        menuAdapter = MenuProductAdapter(menuItems)
//        viewBinding.rcvMenu.adapter = menuAdapter
//
//        // Thiết lập RecyclerView cho sản phẩm
//        viewBinding.rcvFragment.layoutManager = GridLayoutManager(context, 2)
////        adapter = ProductAdapter(ListProduct) { productModel ->
////            val intent = Intent(context, ProductDetailActivity::class.java).apply {
////                putExtra("PRODUCT_ITEM", productModel)
////            }
////            startActivity(intent)
////        }
//
//
//        // Set up ProductAdapter with favorite change callback
//        adapter = FavoritesAdapter(ListProduct, { product ->
//            // Handle product click if needed
//            val intent = Intent(context, ProductDetailActivity::class.java).apply {
////                putExtra("PRODUCT_ITEM", product)
//            }
//            startActivity(intent)
//        }, { product, isFavorite ->
//            // Update favorite products list based on selection
//            if (isFavorite) {
//                favoriteProducts.add(product)
//            } else {
//                favoriteProducts.remove(product)
//            }
//        })
//        viewBinding.rcvFragment.adapter = adapter
//
//        // Kiểm tra nếu danh sách yêu thích trống
//        if (ListProduct.isEmpty()) {
//            viewBinding.tvEmptyFavorites.visibility = View.VISIBLE
//        } else {
//            viewBinding.tvEmptyFavorites.visibility = View.GONE
//        }
//
//    }
    }

}