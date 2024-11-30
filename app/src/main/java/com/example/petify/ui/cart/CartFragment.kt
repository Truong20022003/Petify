package com.example.petify.ui.cart

import android.content.Intent
import android.os.Build
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.data.adress.AddressViewmodel
import com.example.petify.data.database.AppDatabase
import com.example.petify.data.server.enitities.InvoiceDetailModel
import com.example.petify.data.server.enitities.OrderModel
import com.example.petify.databinding.FragmentCartBinding
import com.example.petify.ui.payment.PaymentActivity
import com.example.petify.viewmodel.CartViewModel
import com.example.petify.viewmodel.InvoiceDetailViewModel
import com.example.petify.viewmodel.OrderViewModel
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class CartFragment : BaseFragment<FragmentCartBinding>() {

    private lateinit var cartViewModel: CartViewModel
    private lateinit var addressViewModel: AddressViewmodel

    private lateinit var cartAdapter: CartAdapter
    private var isAllSelected = false
    private lateinit var orderViewModel: OrderViewModel
    private lateinit var invoiceDetailViewModel: InvoiceDetailViewModel
    override fun inflateViewBinding() = FragmentCartBinding.inflate(layoutInflater)

    @RequiresApi(Build.VERSION_CODES.O)
    override fun initView() {
        super.initView()
        addressViewModel = ViewModelProvider(requireActivity())[AddressViewmodel::class.java]
        val cartDao = AppDatabase.getDatabase(requireActivity()).cartDao()
        cartViewModel = CartViewModel(cartDao)
        cartViewModel.fetchCartItems()
        cartAdapter = CartAdapter(emptyList()) { totalPrice ->
            updateTotalPrice(totalPrice)
        }

        cartViewModel.cartItems.observe(viewLifecycleOwner) {
            if (it != null) {
                cartAdapter.updateItems(it)
                viewBinding.rcvCart.layoutManager = LinearLayoutManager(requireContext())
                viewBinding.rcvCart.adapter = cartAdapter

            } else {
                viewBinding.tvEmptyItem.visibility = View.VISIBLE
                cartAdapter.updateItems(emptyList())
            }

        }
        updateTotalPrice(0.0)
        viewBinding.ivCheckAll.setOnClickListener {
            toggleSelectAll()
        }
        orderViewModel = ViewModelProvider(requireActivity())[OrderViewModel::class.java]
        invoiceDetailViewModel =
            ViewModelProvider(requireActivity())[InvoiceDetailViewModel::class.java]

        viewBinding.tvBuy.tap {

            addToOrder()
        }
    }
    @RequiresApi(Build.VERSION_CODES.O)
    private fun addToOrder(){
        val selectedItems = cartAdapter.getSelectedItems()
        val totalPrice = cartAdapter.getTotalPrice()

        val intent = Intent(requireContext(), PaymentActivity::class.java)
        intent.putExtra("totalPrice", totalPrice)
        intent.putExtra("selectedItems", ArrayList(selectedItems))
        startActivity(intent)
    }
    private fun toggleSelectAll() {
        isAllSelected = !isAllSelected
        viewBinding.ivCheckAll.setImageResource(
            if (isAllSelected) R.drawable.ic_check_cart_on else R.drawable.ic_check_cart_off
        )
        cartAdapter.setAllSelected(isAllSelected)
    }

    private fun updateTotalPrice(totalPrice: Double) {
        viewBinding.tvMoney.text = "$totalPrice"
        Log.d("TagCart", "$totalPrice")
    }

}
