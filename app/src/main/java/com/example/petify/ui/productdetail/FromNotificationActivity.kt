package com.example.petify.ui.productdetail

import android.util.Log
import com.example.petify.BaseActivity
import com.example.petify.databinding.ActivityFromNotificationBinding
import com.example.petify.viewmodel.ProductViewModel

class FromNotificationActivity : BaseActivity<ActivityFromNotificationBinding, ProductViewModel>() {
    override fun createBinding(): ActivityFromNotificationBinding {
        return ActivityFromNotificationBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): ProductViewModel {
        return ProductViewModel()
    }

    override fun initView() {
        super.initView()

        viewModel.getLatestSaleUpdatedProduct()

        viewModel.productSaleNew.observe(this) {
            Log.d("FromNotificationActivity", "initView: $it")
            binding.tvProductName.text = it?.product?.name
            binding.tvProductPrice.text = "${it?.product?.price} VNĐ"
            val originalPrice =
                it?.product?.price!! * (1 - it?.product?.sale!! / 100.0)
            binding.tvProductPriceSale.text = "$originalPrice VNĐ"
            binding.tvDescribe.text = it?.product?.description
            binding.tvSold.text = "Số lượng: ${it?.product?.quantity}"
            setupViewPager(it?.product?.image!!)
        }

    }

    private fun setupViewPager(images: List<String>) {
        val adapter = ProductDetailImageAdapter(images)
        binding.viewPager2.adapter = adapter
    }
}