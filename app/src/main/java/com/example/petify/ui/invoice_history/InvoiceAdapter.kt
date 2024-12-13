package com.example.petify.ui.invoice_history

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.data.server.enitities.InvoiceDetailAndProductModel
import com.example.petify.data.server.enitities.InvoiceDetailModel
import com.example.petify.data.server.enitities.OrderResponse
import com.example.petify.databinding.ItemInvoiceBinding

class InvoiceAdapter(
    private val list: MutableList<InvoiceDetailAndProductModel>,
    private val onClick: (InvoiceDetailAndProductModel) -> Unit
) : RecyclerView.Adapter<InvoiceAdapter.ViewHodel>() {


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
            if (list[position].productId != null){
                Glide.with(holder.itemView.context).load(list[position].productId.image[0])
                    .into(ivProduct)
                tvStatus.visibility = View.INVISIBLE
                tvNameProduct.text = list[position].productId.name
                tvQuantityProduct.text = list[position].quantity.toString()
                tvPriceProduct.text = list[position].productId.price.toString()
                tvTotalQuantity.text = list[position].quantity.toString()
                tvTotalAmount.text = list[position].totalPrice.toString()
            }
            tvEvaluate.setOnClickListener {
                onClick(list[position])
            }
        }


    }

    fun fillData(newList: List<InvoiceDetailAndProductModel>) {
        list.clear()
        list.addAll(newList)
        notifyDataSetChanged()
    }
}