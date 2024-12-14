package com.example.petify.ui.invoice_history

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.data.server.enitities.OrderResponse
import com.example.petify.databinding.FragmentInvoiceHistoryBinding
import com.example.petify.ui.review.ReviewWriteActivity
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.InvoiceDetailViewModel
import com.example.petify.viewmodel.UserViewModel


class InvoiceHistoryFragment : BaseFragment<FragmentInvoiceHistoryBinding>() {


    private val invoiceAdapter by lazy {
        InvoiceAdapter(mutableListOf(),onClick = {model ->
            val intent = Intent(requireActivity(), ReviewWriteActivity::class.java)
            intent.putExtra("idProduct",model.productId.id)
            startActivity(intent)
        })
    }
    private lateinit var categoryOrderAdapter: CategoryOrderAdapter

    private val pendingOrders = mutableListOf<OrderResponse>()
    private val shippingOrders = mutableListOf<OrderResponse>()

    private fun updateOrderLists(orders: List<OrderResponse>) {
        pendingOrders.clear()
        shippingOrders.clear()

        orders.forEach { order ->
            when (order.order_id.status) {
                "Đang chờ xác nhận" -> pendingOrders.add(order)
                "Chờ giao hàng" -> shippingOrders.add(order)
                else -> shippingOrders.add(order)
            }
        }

        orderHistoryAdapter.fillData(pendingOrders)
    }


    private val orderHistoryAdapter by lazy {
        OrderHistoryAdapter(mutableListOf(),onClick = {model ->
            val intent = Intent(requireActivity(), ReviewWriteActivity::class.java)
            intent.putExtra("idProduct",model.product_id.id)
            startActivity(intent)
        })
    }

    private lateinit var invoiceDetailViewModel: InvoiceDetailViewModel
    override fun inflateViewBinding(): FragmentInvoiceHistoryBinding {
        return FragmentInvoiceHistoryBinding.inflate(layoutInflater)
    }


    override fun initView() {
        super.initView()
        categoryOrderAdapter = CategoryOrderAdapter(
            listOf("Đang chờ xác nhận", "Chờ giao hàng", "Thành công", "Hủy đơn"),
            onClick = {
                when (it) {
                    0 -> {
                        viewBinding.rvInvoice.visibility = View.GONE
                        viewBinding.rvOrder.visibility = View.VISIBLE
                        orderHistoryAdapter.fillData(pendingOrders)
                    }

                    1 -> {
                        viewBinding.rvInvoice.visibility = View.GONE
                        viewBinding.rvOrder.visibility = View.VISIBLE
                        orderHistoryAdapter.fillData(shippingOrders)
                    }

                    2 -> {
                        viewBinding.rvInvoice.visibility = View.VISIBLE
                        viewBinding.rvOrder.visibility = View.GONE

                    }
                }
            })

        viewBinding.rvStatus.adapter = categoryOrderAdapter
        viewBinding.rvInvoice.adapter = invoiceAdapter
        viewBinding.rvOrder.adapter = orderHistoryAdapter
        viewBinding.rvInvoice.visibility = View.GONE
        viewBinding.rvOrder.visibility = View.VISIBLE
        val userModel = SharePreUtils.getUserModel(requireActivity())
        invoiceDetailViewModel =
            ViewModelProvider(requireActivity())[InvoiceDetailViewModel::class.java]
        invoiceDetailViewModel.getinvoicedetailByIdUser(userModel!!.id)
        invoiceDetailViewModel.invoiceDetailListIdUser.observe(requireActivity()) {invoiceDetails->
            invoiceDetails?.let {
                invoiceAdapter.fillData(it)
            }
        }
        invoiceDetailViewModel.getAllOrderDetailsWithStatus(userModel.id)
        invoiceDetailViewModel.orderDetailListIdUser.observe(requireActivity()) {orderDetails ->
            orderDetails?.let {
                updateOrderLists(it.toMutableList())
                orderHistoryAdapter.fillData(pendingOrders)
                viewBinding.rvOrder.visibility = View.VISIBLE
            }

        }

    }

    override fun bindView() {
        super.bindView()

    }

}