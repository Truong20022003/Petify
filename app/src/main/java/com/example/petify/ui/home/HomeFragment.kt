package com.example.petify.ui.home

import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.viewpager2.widget.ViewPager2
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.databinding.FragmentHomeBinding
import com.example.petify.model.CategoryModel
import com.example.petify.model.ProductModel
import com.example.petify.ui.productdetail.ProductDetailActivity
import com.example.petify.viewmodel.ProductViewModel

class HomeFragment : BaseFragment<FragmentHomeBinding>() {
    private lateinit var adapter: CategoryAdapter
    val handler = Handler(Looper.getMainLooper())

    val images =
        listOf(
            R.drawable.img_slide1,
            R.drawable.img_slide2,
            R.drawable.img_slide3,
            R.drawable.img_slide2
        )

    val productModel = listOf(
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
        )
    )


    val categoryModels = listOf(
        CategoryModel(
            product = "Loại sản phẩm 1",
            items = productModel
        ),
        CategoryModel(
            product = "Loại sản phẩm 2",
            items = productModel
        )
    )

    override fun inflateViewBinding(): FragmentHomeBinding {
        return FragmentHomeBinding.inflate(layoutInflater)
    }

    private lateinit var productViewModel: ProductViewModel

    override fun initView() {
        super.initView()

        productViewModel = ViewModelProvider(requireActivity())[ProductViewModel::class.java]
        productViewModel.getListProduct() // gọi cái này để call list về trước
        productViewModel.productList.observe(requireActivity()){ productList ->
            Log.d("TAG12345","productList: $productList") // lấy cái list này  gắn lên recycleview của product là được mà, còn chia nó theo category thì tự xử lý
        }


        viewBinding.rcvCategory.layoutManager =
            LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false)


        // Khởi tạo adapter
        adapter = CategoryAdapter(categoryModels) { productModel ->
            val intent = Intent(context, ProductDetailActivity::class.java).apply {
//                putExtra("PRODUCT_ITEM", productModel)
            }
            startActivity(intent)
        }

        viewBinding.rcvCategory.layoutManager = LinearLayoutManager(context)

        viewBinding.rcvCategory.adapter = adapter


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


}

