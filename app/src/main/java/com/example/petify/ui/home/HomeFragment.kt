package com.example.petify.ui.home

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.viewpager2.widget.ViewPager2
import com.example.petify.BaseFragment
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.FragmentHomeBinding
import com.example.petify.model.ProductItem
import com.example.petify.model.ProductModel

class HomeFragment : BaseFragment<FragmentHomeBinding>() {

    override fun inflateViewBinding(): FragmentHomeBinding {
        return FragmentHomeBinding.inflate(layoutInflater)
    }

    private lateinit var adapter: HomeAdapter


    val productItems = listOf(
        ProductItem(
            id = "1",
            supplierId = "sup1",
            price = 200000,
            date = "2024-10-01",
            expiryDate = "2025-10-01",
            quantity = 100,
            name = "Sản phẩm A",
            image = listOf(R.drawable.item_sp1), // Thay thế bằng ID hình ảnh thực tế
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
            image = listOf(R.drawable.item_sp1), // Thay thế bằng ID hình ảnh thực tế
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
            image = listOf(R.drawable.item_sp1), // Thay thế bằng ID hình ảnh thực tế
            status = "Hết hàng",
            description = "Mô tả chi tiết cho sản phẩm C",
            sale = 0 // Không có giảm giá
        )
    )


    val productModels = listOf(
        ProductModel(
            product = "Loại sản phẩm 1",
            items = productItems // Danh sách mặt hàng sản phẩm
        ),
        ProductModel(
            product = "Loại sản phẩm 2",
            items = productItems // Danh sách mặt hàng sản phẩm
        )
    )


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

        val images =
            listOf(R.drawable.slide1, R.drawable.slide2, R.drawable.slide3, R.drawable.slide2)

        // Thiết lập layout manager cho RecyclerView
        viewBinding.rcvHome.layoutManager =
            LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false)

        // Khởi tạo adapter và gán cho RecyclerView
        adapter = HomeAdapter(productModels)
        viewBinding.rcvHome.adapter = adapter




        // Khởi tạo adapter cho ViewPager2
        val slideshowAdapter = SlideshowAdapter(images)
        viewBinding.viewPager.adapter = slideshowAdapter

        // Đăng ký callback cho ViewPager2 để cập nhật dots
        viewBinding.viewPager.registerOnPageChangeCallback(object :
            ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)
                updateDots(position) // Cập nhật dots khi trang được lật
            }
        })

        // Optional: Auto-slide sau mỗi 3 giây
        val handler = Handler(Looper.getMainLooper())
        val runnable = object : Runnable {
            var currentPage = 0
            override fun run() {
                if (currentPage == images.size) {
                    currentPage = 0
                }
                viewBinding.viewPager.setCurrentItem(currentPage, true)
                updateDots(currentPage) // Cập nhật dots khi auto-slide
                currentPage++
                handler.postDelayed(this, 3000) // Tự động lật trang sau 3 giây
            }
        }
        handler.post(runnable)

        // Cập nhật dots cho trang đầu tiên khi khởi tạo
        updateDots(0)
    }

    private fun updateDots(position: Int) {
        // Đặt tất cả các dot về trạng thái "off"
        viewBinding.ivDot1.setBackgroundResource(R.drawable.iv_dot_off)
        viewBinding.ivDot2.setBackgroundResource(R.drawable.iv_dot_off)
        viewBinding.ivDot3.setBackgroundResource(R.drawable.iv_dot_off)
        viewBinding.ivDot4.setBackgroundResource(R.drawable.iv_dot_off)

        // Đặt trạng thái "on" cho dot tương ứng với trang hiện tại
        when (position) {
            0 -> viewBinding.ivDot1.setBackgroundResource(R.drawable.iv_dot_on)
            1 -> viewBinding.ivDot2.setBackgroundResource(R.drawable.iv_dot_on)
            2 -> viewBinding.ivDot3.setBackgroundResource(R.drawable.iv_dot_on)
            3 -> viewBinding.ivDot4.setBackgroundResource(R.drawable.iv_dot_on)
        }
    }

}

