package com.example.petify.ui.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.databinding.ItemProductBinding
import com.example.petify.databinding.ItemRcvHomeBinding
import com.example.petify.model.ProductItem
import com.example.petify.model.ProductModel

class ItemAdapter(
private val productList: List<ProductItem>
) : RecyclerView.Adapter<ItemAdapter.ProductViewHolder>() {

    // ViewHolder class sử dụng ViewBinding
    class ProductViewHolder(val binding: ItemProductBinding) : RecyclerView.ViewHolder(binding.root)

    // Tạo ViewHolder (inflate layout cho mỗi item)
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemProductBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }

    // Gắn dữ liệu vào ViewHolder
    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = productList[position]
        holder.binding.apply {
            // Sử dụng chỉ mục để lấy hình ảnh đầu tiên từ danh sách image
            ivProductImage.setImageResource(product.image.first())  // Sử dụng .first() để lấy hình ảnh đầu tiên
            tvProductName.text = product.name
            tvSalePrice.text = "${product.price} đ"
            tvOriginalPrice.apply {
                text = "${product.price} đ"
                paintFlags = paintFlags or android.graphics.Paint.STRIKE_THRU_TEXT_FLAG
            }
            tvSold.text = "Đã bán ${product.quantity}"
        }
    }


    // Trả về số lượng item trong danh sách
    override fun getItemCount(): Int = productList.size
}
