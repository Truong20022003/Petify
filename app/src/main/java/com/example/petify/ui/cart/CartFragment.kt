package com.example.petify.ui.cart

import android.util.Log
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.data.database.AppDatabase
import com.example.petify.databinding.FragmentCartBinding
import com.example.petify.viewmodel.CartViewModel

class CartFragment : BaseFragment<FragmentCartBinding>() {

    private lateinit var cartViewModel: CartViewModel
    private lateinit var cartAdapter: CartAdapter
    private var isAllSelected = false

    override fun inflateViewBinding() = FragmentCartBinding.inflate(layoutInflater)

    override fun initView() {
        super.initView()
        val cartDao = AppDatabase.getDatabase(requireActivity()).cartDao()
        cartViewModel = CartViewModel(cartDao)
        cartViewModel.fetchCartItems()
        cartAdapter = CartAdapter(emptyList()) { totalPrice ->
            updateTotalPrice(totalPrice)
        }
        cartViewModel.cartItems.observe(viewLifecycleOwner){
            if (it != null){
                cartAdapter.updateItems(it)
                viewBinding.rcvCart.layoutManager = LinearLayoutManager(requireContext())
                viewBinding.rcvCart.adapter = cartAdapter

            }else{
                viewBinding.tvEmptyItem.visibility = View.VISIBLE
                cartAdapter.updateItems(emptyList())
            }

        }
        updateTotalPrice(0)
        viewBinding.ivCheckAll.setOnClickListener {
            toggleSelectAll()
        }
    }
    private fun toggleSelectAll() {
        isAllSelected = !isAllSelected
        viewBinding.ivCheckAll.setImageResource(
            if (isAllSelected) R.drawable.ic_check_cart_on else R.drawable.ic_check_cart_off
        )
        cartAdapter.setAllSelected(isAllSelected)
    }
    private fun updateTotalPrice(totalPrice: Int) {
        viewBinding.tvMoney.text = "$totalPrice"
        Log.d("TagCart","$totalPrice")
    }
}
