package com.example.petify.ui.home

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.databinding.ItemProductBinding
import com.example.petify.model.ProductModel

class ProductAdapter(
    private val productList: List<ProductModel>,
    private val itemClickListener: (ProductModel) -> Unit
) : RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {

    class ProductViewHolder(val binding: ItemProductBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemProductBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = productList[position]
        Log.d("TAG1111", "Url ${product.image[0]}")
        holder.binding.apply {
            val imageUrl = product.image[0]

            if (imageUrl.isNotEmpty()) {

                Glide.with(holder.binding.root.context)
                    .load(imageUrl)
                    .into(ivProductImage)
            } else {
                ivProductImage.setImageResource(R.drawable.img_item_sp1)
            }
            tvProductName.text = product.name
            tvDiscount.text = "${product.sale} %"
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
