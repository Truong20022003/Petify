package com.example.petify.ui.invoice_history

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
        holder.binding.apply {
            if (list[position].product_id != null) {
                if (list[position].product_id.image.size > 0) {
                    Glide.with(holder.itemView.context).load(list[position].product_id.image[0])
                        .into(ivProduct)
                }
                tvStatus.text = list[position].order_id.status
                tvNameProduct.text = list[position].product_id.name
                tvQuantityProduct.text = list[position].quantity.toString()
                tvPriceProduct.text = list[position].total_price.toString()
                tvTotalQuantity.text = list[position].quantity.toString()
                tvTotalAmount.text = list[position].total_price.toString()
            }
            tvEvaluate.setOnClickListener{
                onClick(list[position])
            }

        }
    }

    fun fillData(newList: List<OrderResponse>) {
        list.clear()
        list.addAll(newList)
        notifyDataSetChanged()
    }
}