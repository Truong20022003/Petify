package com.example.petify.ui.productdetail

import android.util.Log
import android.widget.Toast
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.databinding.ActivityProductDetailBinding
import com.example.petify.model.ProductModel

class ProductDetailActivity : BaseActivity<ActivityProductDetailBinding, BaseViewModel>() {

    override fun createBinding() = ActivityProductDetailBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()

        val productItem: ProductModel? = intent.getParcelableExtra("PRODUCT_ITEM")

        productItem?.let { product ->
            binding.tvProductName.text = product.name
            binding.tvProductPrice.text = "${product.price} VNĐ"
            binding.tvDescribe.text = product.description
            binding.tvSold.text = "Số lượng: ${product.quantity}"


            setupViewPager(product.image)
        } ?: run {
            Log.e("Product_DetailActivity", "Không nhận được thông tin sản phẩm")
            Toast.makeText(this, "Không nhận được thông tin sản phẩm", Toast.LENGTH_SHORT).show()
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

        binding.ivSearch.setOnClickListener {
            Toast.makeText(this, "Tìm kiếm sản phẩm", Toast.LENGTH_SHORT).show()
        }

        binding.ivShare.setOnClickListener {
            Toast.makeText(this, "Chia sẻ sản phẩm", Toast.LENGTH_SHORT).show()
        }

        binding.ivShoppingCart.setOnClickListener {
        }

        binding.btnAddToCart.setOnClickListener {
            Toast.makeText(this, "Sản phẩm đã được thêm vào giỏ hàng", Toast.LENGTH_SHORT).show()
        }

        binding.btnBuyNow.setOnClickListener {
            Toast.makeText(this, "Bạn đã chọn mua sản phẩm ", Toast.LENGTH_SHORT).show()
        }
    }

}
