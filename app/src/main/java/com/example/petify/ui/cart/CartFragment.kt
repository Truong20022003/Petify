package com.example.petify.ui.cart

import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.databinding.FragmentCartBinding
import com.example.petify.model.ProductModel

class CartFragment : BaseFragment<FragmentCartBinding>() {

    private lateinit var cartAdapter: CartAdapter
    private var isAllSelected = false

    override fun inflateViewBinding() = FragmentCartBinding.inflate(layoutInflater)

    private val productList: List<ProductModel> = listOf(
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

    override fun initView() {
        super.initView()

        viewBinding.rcvCart.layoutManager = LinearLayoutManager(requireContext())
        cartAdapter = CartAdapter(productList) { totalPrice ->
            updateTotalPrice(totalPrice) // Update total price whenever it changes
        }
        viewBinding.rcvCart.adapter = cartAdapter

        // Initialize the total price display
        updateTotalPrice(0)

        // Set up the check all button click listener
        viewBinding.ivCheckAll.setOnClickListener {
            toggleSelectAll()
        }
    }

    private fun toggleSelectAll() {
        isAllSelected = !isAllSelected // Toggle the selection state

        // Update the icon based on selection state
        viewBinding.ivCheckAll.setImageResource(
            if (isAllSelected) R.drawable.ic_check_cart_on else R.drawable.ic_check_cart_off
        )
        // Update the adapter with the new selection state for all products
        cartAdapter.setAllSelected(isAllSelected)
    }

    private fun updateTotalPrice(totalPrice: Int) {
        viewBinding.tvMoney.text = "$totalPrice" // Assuming you have a TextView for displaying the total price

        Log.d("TagCart","$totalPrice")
    }
}
