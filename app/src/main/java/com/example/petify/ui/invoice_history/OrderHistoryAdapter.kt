package com.example.petify.ui.invoice_history

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.data.server.enitities.OrderResponse
import com.example.petify.databinding.ItemInvoiceBinding

class OrderHistoryAdapter(
    private val list: MutableList<OrderResponse>,
    private val onClick: (OrderResponse) -> Unit
) : RecyclerView.Adapter<OrderHistoryAdapter.ViewHodel>() {


    inner class ViewHodel(val binding: ItemInvoiceBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHodel {
        return return ViewHodel(
            ItemInvoiceBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )

    }

    override fun getItemCount(): Int {
        return list.size
    }

    override fun onBindViewHolder(holder: ViewHodel, position: Int) {
        val order = list[position]
        val product = order.product_id
        holder.binding.apply {
            if (list[position].product_id != null) {
                if (list[position].product_id.image.size > 0) {
                    Glide.with(holder.itemView.context).load(list[position].product_id.image[0])
                        .into(ivProduct)
                }
                // Hiển thị trạng thái đơn hàng
                tvStatus.text = order.order_id.status
                // Hiển thị tên sản phẩm
                tvNameProduct.text = product.name
                // Hiển thị giá sản phẩm
                val price = order.total_price
                tvPriceProduct.text = "Giá sản phẩm: $price"
                // Hiển thị số lượng
                val quantity = order.quantity
                tvTotalQuantity.text = "Số lượng: $quantity"
                // Tính toán tổng tiền
                val totalAmount = price * quantity
                tvTotalAmount.text = "Tổng tiền: $totalAmount"

            }
            tvEvaluate.setOnClickListener {
                onClick(list[position])
            }

        }
    }

    fun fillData(newList: List<OrderResponse>) {
        Log.d("TAG12345", "fillData: $newList")
        list.clear()
        list.addAll(newList)
        notifyDataSetChanged()
    }
}