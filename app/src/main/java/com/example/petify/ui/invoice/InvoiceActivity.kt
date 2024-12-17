package com.example.petify.ui.invoice

import android.content.Intent
import android.util.Log
import android.view.View
import androidx.lifecycle.ViewModelProvider
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.base.view.tap
import com.example.petify.data.server.enitities.OrderResponse
import com.example.petify.databinding.ActivityInvoiceBinding
import com.example.petify.ui.invoice_history.CategoryOrderAdapter
import com.example.petify.ui.invoice_history.InvoiceAdapter
import com.example.petify.ui.invoice_history.OrderHistoryAdapter
import com.example.petify.ui.review.ReviewWriteActivity
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.InvoiceDetailViewModel

class InvoiceActivity : BaseActivity<ActivityInvoiceBinding, BaseViewModel>() {

    private val invoiceAdapter by lazy {
        InvoiceAdapter(mutableListOf(), onClick = { model ->
            val intent = Intent(this@InvoiceActivity, ReviewWriteActivity::class.java)
            intent.putExtra("idProduct", model.productId.id)
            startActivity(intent)
        })
    }

    private lateinit var categoryOrderAdapter: CategoryOrderAdapter

    private val pendingOrders = mutableListOf<OrderResponse>()
    private val shippingOrders = mutableListOf<OrderResponse>()
    private val failedOrders = mutableListOf<OrderResponse>()

    private fun updateOrderLists(orders: List<OrderResponse>) {
        pendingOrders.clear()
        shippingOrders.clear()
        failedOrders.clear()
        Log.d("InvoiceActivity",orders.toString())

        orders.forEach { order ->
            Log.d("InvoiceActivity",order.toString())
            when (order.order_id.status) {
                "Đang chờ xác nhận" -> pendingOrders.add(order)
                "Chờ giao hàng" -> shippingOrders.add(order)
                "Hủy đơn"-> failedOrders.add(order)
                else -> shippingOrders.add(order)
            }
        }

        orderHistoryAdapter.fillData(pendingOrders)
    }


    private val orderHistoryAdapter by lazy {
        OrderHistoryAdapter(mutableListOf(), onClick = { model ->
            val intent = Intent(this@InvoiceActivity, ReviewWriteActivity::class.java)
            intent.putExtra("idProduct", model.product_id.id)
            startActivity(intent)
        })
    }

    private lateinit var invoiceDetailViewModel: InvoiceDetailViewModel

    override fun createBinding() = ActivityInvoiceBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()


    override fun initView() {
        super.initView()

        binding.imgBack.tap {
            finish()
        }

        categoryOrderAdapter = CategoryOrderAdapter(
            listOf("Đang chờ xác nhận", "Chờ giao hàng", "Thành công", "Hủy đơn"),
            onClick = {
                when (it) {
                    0 -> {
                        binding.rvInvoice.visibility = View.GONE
                        binding.rvOrder.visibility = View.VISIBLE
                        orderHistoryAdapter.fillData(pendingOrders)
                    }

                    1 -> {
                        binding.rvInvoice.visibility = View.GONE
                        binding.rvOrder.visibility = View.VISIBLE
                        orderHistoryAdapter.fillData(shippingOrders)
                    }

                    2 -> {
                        binding.rvInvoice.visibility = View.VISIBLE
                        binding.rvOrder.visibility = View.GONE

                    }
                    3-> {
                        binding.rvInvoice.visibility = View.GONE
                        binding.rvOrder.visibility = View.VISIBLE
                        orderHistoryAdapter.fillData(failedOrders)
                    }
                }
            })

        binding.rvStatus.adapter = categoryOrderAdapter
        binding.rvInvoice.adapter = invoiceAdapter
        binding.rvOrder.adapter = orderHistoryAdapter
        binding.rvInvoice.visibility = View.GONE
        binding.rvOrder.visibility = View.VISIBLE
        val userModel = SharePreUtils.getUserModel(this@InvoiceActivity)
        invoiceDetailViewModel =
            ViewModelProvider(this@InvoiceActivity)[InvoiceDetailViewModel::class.java]
        invoiceDetailViewModel.getinvoicedetailByIdUser(userModel!!.id)
        invoiceDetailViewModel.invoiceDetailListIdUser.observe(this@InvoiceActivity) { invoiceDetails ->
            Log.d("InvoiceActivity", invoiceDetails.toString())
            invoiceDetails?.let {
                invoiceAdapter.fillData(it)
            }
        }
            Log.d("InvoiceActivity", "initView: ${userModel.id}")
        invoiceDetailViewModel.getAllOrderDetailsWithStatus(userModel.id)
        invoiceDetailViewModel.orderDetailListIdUser.observe(this@InvoiceActivity) { orderDetails ->
            orderDetails?.let {
                updateOrderLists(it.toMutableList())
                orderHistoryAdapter.fillData(pendingOrders)
                binding.rvOrder.visibility = View.VISIBLE
            }

        }

    }
}