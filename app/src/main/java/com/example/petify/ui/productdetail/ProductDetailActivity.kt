package com.example.petify.ui.productdetail

import android.content.Intent
import android.util.Log
import android.widget.Toast
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.data.database.AppDatabase
import com.example.petify.data.server.enitities.CartRequest
import com.example.petify.data.server.enitities.FavoriteRequest
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.ActivityProductDetailBinding
import com.example.petify.ui.home.ProductAdapter
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.CartApiViewModel
import com.example.petify.viewmodel.CartViewModel
import com.example.petify.viewmodel.CartViewModelFactory
import com.example.petify.viewmodel.FavoriteViewModel
import com.example.petify.viewmodel.ProductViewModel
import com.example.petify.viewmodel.ReviewViewModel


class ProductDetailActivity : BaseActivity<ActivityProductDetailBinding, BaseViewModel>() {
    private lateinit var revirewViewModel: ReviewViewModel
    private lateinit var reviewAdapter: ReviewAdapter
    private lateinit var productAdapter: ProductAdapter
    private lateinit var productViewModel: ProductViewModel
    private lateinit var cartApi: CartApiViewModel
    private lateinit var cartViewModel: CartViewModel
    private lateinit var favoriteViewModel: FavoriteViewModel
    override fun createBinding() = ActivityProductDetailBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()
        val userModel = SharePreUtils.getUserModel(this@ProductDetailActivity)
        productViewModel =
            ViewModelProvider(this@ProductDetailActivity)[ProductViewModel::class.java]
        revirewViewModel =
            ViewModelProvider(this@ProductDetailActivity)[ReviewViewModel::class.java]
        reviewAdapter = ReviewAdapter(emptyList())
        productViewModel.getListProduct()
        val cartDao = AppDatabase.getDatabase(this).cartDao()

        val factory = CartViewModelFactory(cartDao)
        favoriteViewModel = ViewModelProvider(this)[FavoriteViewModel::class.java]
        favoriteViewModel.getListFavorites(userModel!!.id)
        cartViewModel = ViewModelProvider(this, factory)[CartViewModel::class.java]
        cartApi = ViewModelProvider(this)[CartApiViewModel::class.java]

        productAdapter = ProductAdapter(
            productList = emptyList(), // Danh sách sản phẩm ban đầu
            favoriteList = emptyList(), // Danh sách yêu thích ban đầu
            itemClickListener = { productModel ->
                val intent = Intent(this, ProductDetailActivity::class.java)
                intent.putExtra("productModel", productModel)
                startActivity(intent)
            },
            onFavoriteChanged = { productModel, isFavorite ->
                if (isFavorite) {
                    val favoriteRequest = FavoriteRequest(productModel.id, userModel!!.id)
                    favoriteViewModel.addFavorites(favoriteRequest)
                    Log.d(
                        "TAG12345",
                        "ProductThanhCong ${productModel.id} favorite status: $isFavorite"
                    )
                    Toast.makeText(
                        this@ProductDetailActivity,
                        "Thêm sản phẩm vào màn yêu thích thành công",
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                    favoriteViewModel.deleteFavorite(productModel.id, userModel!!.id)

                    Log.d(
                        "TAG12345",
                        "ProductThatBai ${productModel.id} favorite status: $isFavorite"
                    )
                }
                Log.d(
                    "TAG12345",
                    "Product ${productModel.id} favorite status: $isFavorite"
                )
            },
            onAddToCart = { productModel, isAddToCart ->
                if (userModel?.id != null || userModel.email != null || userModel.phoneNumber != null || userModel.location != null) {
                    if (isAddToCart) {
                        val cartItem = CartRequest(
                            productModel.id,
                            userModel!!.id,
                            1
                        )
                        cartApi.addCart(cartItem)
                        cartApi.cartResponse.observe(this) {
                            it?.let {
                                Log.d("TAG1234", "${it.status}")
                                Toast.makeText(this, "${it.status}", Toast.LENGTH_SHORT).show()
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
                        this,
                        "Hoàn tất hồ sơ người dùng để thêm vào giỏ hàng",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

        )

        // Lấy dữ liệu sản phẩm từ Intent
        val productItem: ProductModel? = intent.getParcelableExtra("productModel")

        productItem?.let { product ->
            revirewViewModel.getReviewByProductId(product.id)
            binding.tvProductName.text = product.name
            binding.tvProductPrice.text = "${product.price} VNĐ"
            binding.tvDescribe.text = product.description
            binding.tvSold.text = "Số lượng: ${product.quantity}"


            setupViewPager(product.image)
        } ?: run {
            Log.e("Product_DetailActivity", "Không nhận được thông tin sản phẩm")
            Toast.makeText(this, "Không nhận được thông tin sản phẩm", Toast.LENGTH_SHORT).show()
        }

        // Lắng nghe thay đổi từ API để cập nhật sản phẩm
        productViewModel.productList.observe(this) { product ->
            Log.d("ProductDetailActivity", "productResponse: $product")
            product?.let {
                productAdapter.fillData(product)
                // Cập nhật dữ liệu cho adapter khi danh sách thay đổi
                binding.rcvProducts.layoutManager = GridLayoutManager(this, 2)
                binding.rcvProducts.adapter = productAdapter

            }
        }


        revirewViewModel.reviewResponse.observe(this) { reviewResponse ->
            Log.d("ProductDetailActivity", "reviewResponse: $reviewResponse")
            reviewResponse?.let {
                reviewAdapter.fillData(it.result)
                binding.rcyReview.layoutManager = LinearLayoutManager(this)
                binding.rcyReview.adapter = reviewAdapter

            }
        }
        setListeners()
    }

    private fun setupViewPager(images: List<String>) {
        val adapter = ProductDetailImageAdapter(images)
        binding.viewPager2.adapter = adapter
    }

    private fun setListeners() {
        binding.ivLeft.setOnClickListener {
            finish()
        }



        binding.ivShare.setOnClickListener {
            Toast.makeText(this, "Chia sẻ sản phẩm", Toast.LENGTH_SHORT).show()
        }


        binding.btnAddToCart.setOnClickListener {
            Toast.makeText(this, "Sản phẩm đã được thêm vào giỏ hàng", Toast.LENGTH_SHORT).show()
        }

        binding.btnBuyNow.setOnClickListener {
            Toast.makeText(this, "Bạn đã chọn mua sản phẩm ", Toast.LENGTH_SHORT).show()
        }
    }

}
