package com.example.petify.ui.home

import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.viewpager2.widget.ViewPager2
import com.bumptech.glide.Glide
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.databinding.FragmentHomeBinding
import com.example.petify.ui.productdetail.ProductDetailActivity
import com.example.petify.ui.profile.ProfileActivity
import com.example.petify.base.view.tap
import com.example.petify.data.database.AppDatabase
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.ui.search.SearchActivity
import com.example.petify.ui.setting.SettingActivity
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.CartViewModel
import com.example.petify.viewmodel.CartViewModelFactory
import com.example.petify.viewmodel.CategoryViewModel
import com.example.petify.viewmodel.ProductCategoryViewModel
import com.example.petify.viewmodel.ProductViewModel

class HomeFragment : BaseFragment<FragmentHomeBinding>() {
    private var adapter: CategoryAdapter? = null
    val handler = Handler(Looper.getMainLooper())

    val images =
        listOf(
            R.drawable.img_slide1,
            R.drawable.img_slide2,
            R.drawable.img_slide3,
            R.drawable.img_slide2
        )


    override fun inflateViewBinding(): FragmentHomeBinding {
        return FragmentHomeBinding.inflate(layoutInflater)
    }

    private lateinit var productViewModel: ProductViewModel
    private lateinit var categoryViewModel: CategoryViewModel
    private lateinit var productCategoryViewModel: ProductCategoryViewModel
    private lateinit var categoryProductParentAdapter: CategoryProductParentAdapter
    private lateinit var cartViewModel: CartViewModel

    override fun initView() {
        super.initView()
        val userModel = SharePreUtils.getUserModel(requireActivity())
        Glide.with(requireActivity())
            .load(userModel?.avata)
            .into(viewBinding.ivUser)
        val cartDao = AppDatabase.getDatabase(requireContext()).cartDao()

        val factory = CartViewModelFactory(cartDao)
        cartViewModel = ViewModelProvider(this, factory)[CartViewModel::class.java]
        productViewModel = ViewModelProvider(requireActivity())[ProductViewModel::class.java]
        productViewModel.getListProduct() // gọi cái này để call list về trước
        productViewModel.productList.observe(requireActivity()) { productList ->
            Log.d(
                "TAG12345",
                "productList: $productList"
            ) // lấy cái list này  gắn lên recycleview của product là được mà, còn chia nó theo category thì tự xử lý
        }
        categoryViewModel = ViewModelProvider(requireActivity())[CategoryViewModel::class.java]
        categoryViewModel.getListCategory()
        categoryViewModel.categoryList.observe(requireActivity()) {
            Log.d("TAG12345", "categoryList: $it")
            it?.let {
                adapter = CategoryAdapter(
                    it,
                    itemClickListener = { productModel ->
                        val intent = Intent(context, ProductDetailActivity::class.java).apply {
                        }
                        startActivity(intent)
                    },
                )
                viewBinding.rvCategory.adapter = adapter
            }
        }


        productCategoryViewModel =
            ViewModelProvider(requireActivity())[ProductCategoryViewModel::class.java]
        productCategoryViewModel.getProductsGroupedByCategory()
        productCategoryViewModel.responseProductCategoryList.observe(this) {
            Log.d("TAG12345", "productCategoryList: $it")
            it?.let { categories ->
                categoryProductParentAdapter = CategoryProductParentAdapter(
                    categories.toMutableList(),
                    itemClickListener = { productModel ->
                        val intent = Intent(context, ProductDetailActivity::class.java)
                        startActivity(intent)
                    },
                    onFavoriteChanged = { productModel, isFavorite ->
                        Log.d(
                            "TAG12345",
                            "Product ${productModel.id} favorite status: $isFavorite"
                        )
                    },
                    onAddToCart = { productModel, isAddToCart ->
                        if (isAddToCart) {
                            val cartItem = CartItem(
                                id = productModel.id,
                                supplierId = productModel.supplierId,
                                price = productModel.price,
                                date = productModel.date,
                                expiryDate = productModel.expiryDate,
                                quantity = 1,
                                name = productModel.name,
                                image = productModel.image,
                                status = productModel.status,
                                description = productModel.description,
                                sale = productModel.sale
                            )
                            cartViewModel.addToCart(cartItem)
                        }
                        Log.d(
                            "TAG12345",
                            "Product ${productModel.id} favorite status: $isAddToCart"
                        )
                    }
                )

                viewBinding.rvProduct.adapter = categoryProductParentAdapter
                viewBinding.rvProduct.layoutManager = LinearLayoutManager(requireContext())


            }

        }
        viewBinding.ivUser.tap {
            val intent = Intent(requireContext(), SettingActivity::class.java)
            startActivity(intent)

        }
        viewBinding.ivSearch.setOnClickListener{
            val intent = Intent(requireContext(), SearchActivity::class.java)
            startActivity(intent)
        }
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
            viewBinding.ivDot1,
            viewBinding.ivDot2,
            viewBinding.ivDot3,
            viewBinding.ivDot4
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
        Glide.with(requireActivity())
            .load(userModel?.avata)
            .into(viewBinding.ivUser)
    }

}

