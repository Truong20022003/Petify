package com.example.petify.ui.home

import HomeAdapter
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.viewpager2.widget.ViewPager2
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.databinding.FragmentHomeBinding
import com.example.petify.model.ProductItem
import com.example.petify.model.ProductModel

class HomeFragment : BaseFragment<FragmentHomeBinding>() {
    private lateinit var adapter: HomeAdapter
    val handler = Handler(Looper.getMainLooper())

    val images =
        listOf(R.drawable.img_slide1, R.drawable.img_slide2, R.drawable.img_slide3, R.drawable.img_slide2)

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


    val productModels = listOf(
        ProductModel(
            product = "Loại sản phẩm 1",
            items = productItems
        ),
        ProductModel(
            product = "Loại sản phẩm 2",
            items = productItems
        )
    )

    override fun inflateViewBinding(): FragmentHomeBinding {
        return FragmentHomeBinding.inflate(layoutInflater)
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Khởi tạo viewBinding
        viewBinding = FragmentHomeBinding.inflate(inflater, container, false)
        return viewBinding.root
    }

    override fun initView() {
        super.initView()



        viewBinding.rcvHome.layoutManager =
            LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false)


        // Khởi tạo adapter
        adapter = HomeAdapter(productModels) { productItem ->
            val intent = Intent(context, Product_DetailActivity::class.java).apply {
                putExtra("PRODUCT_ITEM", productItem)
            }
            startActivity(intent)
        }

        viewBinding.rcvHome.layoutManager = LinearLayoutManager(context)

        viewBinding.rcvHome.adapter = adapter


        val slideshowAdapter = SlideshowAdapter(images)
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


}

