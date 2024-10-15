package com.example.petify.ui.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.databinding.ItemProductBinding
import com.example.petify.model.ProductItem

class ItemAdapter(
    private val productList: List<ProductItem>,
    private val itemClickListener: (ProductItem) -> Unit
) : RecyclerView.Adapter<ItemAdapter.ProductViewHolder>() {

    class ProductViewHolder(val binding: ItemProductBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemProductBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = productList[position]
        holder.binding.apply {
            ivProductImage.setImageResource(product.image.first())
            tvProductName.text = product.name
            tvSalePrice.text = "${product.price} đ"
            tvOriginalPrice.apply {
                text = "${product.price} đ"
                paintFlags = paintFlags or android.graphics.Paint.STRIKE_THRU_TEXT_FLAG
            }
            tvSold.text = "Đã bán ${product.quantity}"

            holder.itemView.setOnClickListener {
                itemClickListener(product)
            }
        }
    }

    override fun getItemCount(): Int = productList.size
}

