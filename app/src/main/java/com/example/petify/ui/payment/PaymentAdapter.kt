package com.example.petify.ui.payment

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.databinding.ItemRvPaymentBinding

class PaymentAdapter(
    private var paymentList: List<CartItem>
) : RecyclerView.Adapter<PaymentAdapter.PaymentViewHolder>() {

    fun updateItems(newItems: List<CartItem>) {
        paymentList = newItems
        notifyDataSetChanged()
    }
    inner class PaymentViewHolder(val binding: ItemRvPaymentBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PaymentViewHolder {

        return PaymentViewHolder(
            ItemRvPaymentBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )
    }

    override fun getItemCount(): Int {
        return paymentList.size
    }

    override fun onBindViewHolder(holder: PaymentViewHolder, position: Int) {

        holder.binding.tvQuantity.setText("${paymentList[position].quantity} sản phẩm")
        holder.binding.tvNameProduct.setText(paymentList[position].name)
        holder.binding.tvPriceProduct.setText("${paymentList[position].price} đ")
        Glide.with(holder.binding.root.context)
            .load(paymentList[position].image[0])
            .into(holder.binding.ivImageProduct)
    }
}