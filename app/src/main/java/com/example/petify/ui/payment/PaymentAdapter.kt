package com.example.petify.ui.payment

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.databinding.ItemRvPaymentBinding
import java.text.NumberFormat
import java.util.Locale

class PaymentAdapter(
    private var paymentList: List<CartResponse>
) : RecyclerView.Adapter<PaymentAdapter.PaymentViewHolder>() {

    fun updateItems(newItems: List<CartResponse>) {
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
        holder.binding.tvNameProduct.setText(paymentList[position].productId.name)
        val formattedPrice = formatPrice(paymentList[position].productId.price)
        holder.binding.tvPriceProduct.text = "$formattedPrice đ"
        Glide.with(holder.binding.root.context)
            .load(paymentList[position].productId.image[0])
            .into(holder.binding.ivImageProduct)
    }


    fun formatPrice(price: Double): String {
        val formatter = NumberFormat.getNumberInstance(Locale("vi", "VN")) // Định dạng kiểu Việt Nam
        return formatter.format(price)
    }
}