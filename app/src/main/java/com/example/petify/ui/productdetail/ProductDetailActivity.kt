package com.example.petify.ui.productdetail

import android.util.Log
import android.widget.Toast
import androidx.lifecycle.ViewModelProvider
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.ActivityProductDetailBinding
import com.example.petify.viewmodel.ProductViewModel
import com.example.petify.viewmodel.ReviewViewModel


class ProductDetailActivity : BaseActivity<ActivityProductDetailBinding, BaseViewModel>() {


    private lateinit var revirewViewModel: ReviewViewModel
    override fun createBinding() = ActivityProductDetailBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()
        revirewViewModel = ViewModelProvider(this)[ReviewViewModel::class.java]

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
        revirewViewModel.reviewResponse.observe(this){
            Log.d("Revview", "reviewResponse: $it")
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
