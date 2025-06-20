package com.example.petify.ui.home

import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.viewpager2.widget.ViewPager2
import com.bumptech.glide.Glide
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.data.database.AppDatabase
import com.example.petify.data.server.enitities.CartRequest
import com.example.petify.data.server.enitities.FavoriteRequest
import com.example.petify.data.server.enitities.FavoriteResponse
import com.example.petify.databinding.FragmentHomeBinding
import com.example.petify.ui.productdetail.ProductDetailActivity
import com.example.petify.ui.search.SearchActivity
import com.example.petify.ui.setting.SettingActivity
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.CartApiViewModel
import com.example.petify.viewmodel.CartViewModel
import com.example.petify.viewmodel.CartViewModelFactory
import com.example.petify.viewmodel.CategoryViewModel
import com.example.petify.viewmodel.FavoriteViewModel
import com.example.petify.viewmodel.ProductCategoryViewModel
import com.example.petify.viewmodel.ProductViewModel

class HomeFragment : BaseFragment<FragmentHomeBinding>() {
    private var adapter: CategoryAdapter? = null
    val handler = Handler(Looper.getMainLooper())

    val images = listOf(
        R.drawable.img_slide1, R.drawable.img_slide2, R.drawable.img_slide3, R.drawable.img_slide2
    )


    override fun inflateViewBinding(): FragmentHomeBinding {
        return FragmentHomeBinding.inflate(layoutInflater)
    }

    private lateinit var productViewModel: ProductViewModel
    private lateinit var categoryViewModel: CategoryViewModel
    private lateinit var productCategoryViewModel: ProductCategoryViewModel
    private lateinit var categoryProductParentAdapter: CategoryProductParentAdapter
    private lateinit var cartViewModel: CartViewModel
    private lateinit var favoriteViewModel: FavoriteViewModel
    private lateinit var cartApi: CartApiViewModel
    private lateinit var productAdapter: ProductAdapter
    private var listFavorite1: List<FavoriteResponse> = emptyList()
    override fun initView() {
        super.initView()
        val userModel = SharePreUtils.getUserModel(requireActivity())

        productCategoryViewModel =
            ViewModelProvider(requireActivity())[ProductCategoryViewModel::class.java]
        productCategoryViewModel.getProductsGroupedByCategory()
        favoriteViewModel = ViewModelProvider(requireActivity())[FavoriteViewModel::class.java]
        favoriteViewModel.getListFavorites(userModel!!.id)
        Glide.with(requireActivity()).load(userModel?.avata).error(R.drawable.image_default)
            .into(viewBinding.ivUser)
        val cartDao = AppDatabase.getDatabase(requireContext()).cartDao()

        val factory = CartViewModelFactory(cartDao)
        cartViewModel = ViewModelProvider(this, factory)[CartViewModel::class.java]
        productViewModel = ViewModelProvider(requireActivity())[ProductViewModel::class.java]
        cartApi = ViewModelProvider(requireActivity())[CartApiViewModel::class.java]

        categoryViewModel = ViewModelProvider(requireActivity())[CategoryViewModel::class.java]
        categoryViewModel.getListCategory()

        viewBinding.rvCategory.visibility = View.GONE
        viewBinding.btnAll.visibility = View.GONE
        categoryViewModel.categoryList.observe(requireActivity()) {
//            Log.d("TAG12345", "categoryList: $it")
            it?.let {
                adapter = CategoryAdapter(
                    it,
                    itemClickListener = { productModel ->

                    },
                )
//                viewBinding.rvCategory.adapter = adapter
            }
        }
        productAdapter = ProductAdapter(
            productList = emptyList(), // Danh sách sản phẩm ban đầu rỗng
            favoriteList = listFavorite1, // Danh sách yêu thích ban đầu
            itemClickListener = { productModel ->
                // Xử lý sự kiện khi click vào item
                val intent = Intent(context, ProductDetailActivity::class.java)
                intent.putExtra("productModel", productModel)
                startActivity(intent)
            },
            onFavoriteChanged = { productModel, isFavorite ->
                // Xử lý thêm/xóa sản phẩm khỏi danh sách yêu thích
                if (isFavorite) {
                    val favoriteRequest = FavoriteRequest(productModel.id, userModel!!.id)
                    favoriteViewModel.addFavorites(favoriteRequest)
                } else {
                    favoriteViewModel.deleteFavorite(productModel.id, userModel!!.id)
                }
            },
            onAddToCart = { productModel, isAddToCart ->
                // Xử lý thêm sản phẩm vào giỏ hàng
                if (isAddToCart) {
                    val cartItem = CartRequest(productModel.id, userModel!!.id, 1)
                    cartApi.addCart(cartItem)
                }
            }
        )
        productViewModel.getListProduct()
        productViewModel.productList.observe(this) { listProduct ->
            Log.d("listPRODUCT", listProduct.toString())
            listProduct?.let {
                productAdapter.fillData(it.toMutableList())
            }
        }
        viewBinding.rvProductSearch.adapter = productAdapter
        favoriteViewModel.favoriteList.observe(this) { listFavorite ->
            listFavorite1 =
                listFavorite ?: emptyList() // Gán danh sách trống nếu listFavorite là null
        }
        productCategoryViewModel.responseProductCategoryList.observe(this) {
//            Log.d("TAG12345", "productCategoryList: $it")
            it?.let { categories ->
                categoryProductParentAdapter = CategoryProductParentAdapter(
                    categories.toMutableList(),
                    itemClickListener = { productModel ->
                        val intent = Intent(context, ProductDetailActivity::class.java)
                        intent.putExtra("productModel", productModel)
                        startActivity(intent)
                    },
                    onFavoriteChanged = { productModel, isFavorite ->
                        if (isFavorite) {
                            val favoriteRequest = FavoriteRequest(productModel.id, userModel!!.id)
                            favoriteViewModel.addFavorites(favoriteRequest)
                            // Tạo đối tượng FavoriteResponse
                            val favoriteResponse = FavoriteResponse(
                                id = "", // Nếu không có giá trị ID, để trống hoặc xử lý theo API trả về
                                userId = userModel.id,
                                productId = productModel // Truyền toàn bộ đối tượng productModel
                            )
                            listFavorite1 =
                                listFavorite1 + favoriteResponse // Thêm vào danh sách yêu thích
                            Log.d(
                                "TAG12345",
                                "ProductThanhCong ${productModel.id} favorite status: $isFavorite"
                            )
                            Toast.makeText(
                                requireActivity(),
                                "Thêm sản phẩm vào màn yêu thích thành công",
                                Toast.LENGTH_SHORT
                            ).show()
                        } else {
                            favoriteViewModel.deleteFavorite(productModel.id, userModel!!.id)
                            listFavorite1 =
                                listFavorite1.filter { it.productId.id != productModel.id } // Loại bỏ sản phẩm khỏi danh sách yêu thích
                            Log.d(
                                "TAG12345",
                                "ProductThatBai ${productModel.id} favorite status: $isFavorite"
                            )
                            Toast.makeText(
                                requireActivity(),
                                "Xóa sản phẩm yêu thích thành công",
                                Toast.LENGTH_SHORT
                            ).show()
                        }

                        // Cập nhật danh sách yêu thích trong adapter
                        categoryProductParentAdapter.updateFavoriteList(listFavorite1)
                        categoryProductParentAdapter.notifyDataSetChanged() // Cập nhật lại adapter
                        Log.d("TAG12345", "Product ${productModel.id} favorite status: $isFavorite")
                    },
                    onAddToCart = { productModel, isAddToCart ->
                        if (userModel.id.isNotEmpty() && userModel.email.isNotEmpty() && userModel.phoneNumber.isNotEmpty()) {
                            if (isAddToCart) {
                                val cartItem = CartRequest(
                                    productModel.id, userModel!!.id, 1
                                )
                                cartApi.addCart(cartItem)
                                cartApi.cartResponse.observe(this) {
                                    it?.let {
                                        Log.d("TAG1234", "${it.status}")
                                        Toast.makeText(
                                            requireActivity(), "${it.status}", Toast.LENGTH_SHORT
                                        ).show()
                                        cartApi.clearCartResponse()
                                    }

                                }
                            }
                            Log.d(
                                "TAG12345",
                                "Product ${productModel.id} favorite status: $isAddToCart"
                            )
                        } else {
                            Toast.makeText(
                                requireActivity(),
                                "Hoàn tất hồ sơ người dùng để thêm vào giỏ hàng",
                                Toast.LENGTH_SHORT
                            ).show()
                        }

                    },
                    listFavorite1!!.toMutableList(),
//                        emptyList(),
                )
                viewBinding.rvProduct.adapter = categoryProductParentAdapter
                viewBinding.rvProduct.layoutManager = LinearLayoutManager(requireContext())


            }
        }
        viewBinding.ivUser.tap {
            val intent = Intent(requireContext(), SettingActivity::class.java)
            startActivity(intent)

        }
        viewBinding.ivSearch.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {

            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val query = s.toString().trim()
                if (query.isNotEmpty()) {
                    hideOtherViews() // Ẩn các view khác
                    viewBinding.rvProductSearch.visibility = View.VISIBLE
                    filterProducts(query)
                } else {
                    showOtherViews() // Hiển thị lại các view
                    viewBinding.rvProductSearch.visibility = View.GONE
                }
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {

            }
        })
        val slideshowAdapter = Home_SlideshowAdapter(images)
        viewBinding.viewPager.adapter = slideshowAdapter

        viewBinding.viewPager.registerOnPageChangeCallback(object :
            ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)
                updateDots(position)
            }
        })

        val runnable = object : Runnable {
            var currentPage = 0
            override fun run() {
                if (currentPage == images.size) {
                    currentPage = 0
                }
                viewBinding.viewPager.setCurrentItem(currentPage, true)
                updateDots(currentPage)
                currentPage++
                handler.postDelayed(this, 3000)
            }
        }
        handler.post(runnable)

        updateDots(0)
    }

    private fun updateDots(position: Int) {
        val dotViews = listOf(
            viewBinding.ivDot1, viewBinding.ivDot2, viewBinding.ivDot3, viewBinding.ivDot4
        )

        dotViews.forEachIndexed { index, dotView ->
            dotView.setBackgroundResource(
                if (index == position) R.drawable.iv_dot_on else R.drawable.iv_dot_off
            )
        }
    }

    override fun onResume() {
        super.onResume()
        val userModel = SharePreUtils.getUserModel(requireActivity())
        Glide.with(requireActivity()).load(userModel?.avata).into(viewBinding.ivUser)
        // Cập nhật lại danh sách yêu thích
        favoriteViewModel.getListFavorites(userModel!!.id)

        // Cập nhật lại danh sách sản phẩm nếu cần thiết
        productCategoryViewModel.getProductsGroupedByCategory()
    }

    private fun filterProducts(query: String) {
        val filteredList = productViewModel.productList.value?.filter { product ->
            product.name.contains(query, ignoreCase = true)
        } ?: emptyList()
        Log.d("list12333", filteredList.toString())
        productAdapter.fillData(filteredList.toMutableList())
    }

    // Hàm ẩn các View khác
    private fun hideOtherViews() {
        viewBinding.constraintHomeTop.visibility = View.GONE
        viewBinding.viewPager.visibility = View.GONE
        viewBinding.btnAll.visibility = View.GONE
        viewBinding.rvCategory.visibility = View.GONE
        viewBinding.rvProduct.visibility = View.GONE
        viewBinding.rvProductSearch.visibility = View.VISIBLE
    }

    private fun showOtherViews() {
        viewBinding.constraintHomeTop.visibility = View.VISIBLE
        viewBinding.viewPager.visibility = View.VISIBLE
        viewBinding.btnAll.visibility = View.VISIBLE
        viewBinding.rvCategory.visibility = View.VISIBLE
        viewBinding.rvProduct.visibility = View.VISIBLE
        viewBinding.rvProductSearch.visibility = View.GONE

    }

}

