package com.example.petify.ui.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.databinding.ItemRcvHomeBinding
import com.example.petify.model.ProductModel

class HomeAdapter(
    private val productList: List<ProductModel>
) : RecyclerView.Adapter<HomeAdapter.ProductViewHolder>() {

    // ViewHolder class sử dụng ViewBinding
    class ProductViewHolder(val binding: ItemRcvHomeBinding) : RecyclerView.ViewHolder(binding.root)

    // Tạo ViewHolder (inflate layout cho mỗi item)
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemRcvHomeBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }


    // Gắn dữ liệu vào ViewHolder
    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = productList[position]
        holder.binding.apply {
            tvDes.text = product.product // Hiển thị mô tả sản phẩm
            // Thiết lập ItemAdapter ở đây nếu bạn sử dụng RecyclerView lồng nhau
            val itemAdapter = ItemAdapter(product.items ?: emptyList()) // Giả sử product.items là List<ProductItem>
            rvItem.adapter = itemAdapter // Giả sử bạn có RecyclerView trong ItemRcvHomeBinding
        }
    }


    // Trả về số lượng item trong danh sách
    override fun getItemCount(): Int = productList.size
}
