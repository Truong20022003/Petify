package com.example.petify.ui.home

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.data.server.enitities.CategoryWithProductsModel
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.ItemRcvCategoryBinding

class CategoryProductParentAdapter(

    private val categoryModels: List<CategoryWithProductsModel>,
    private val itemClickListener: (ProductModel) -> Unit,
    private val onFavoriteChanged: (ProductModel, Boolean) -> Unit,
    private val onAddToCart: (ProductModel, Boolean) -> Unit
) : RecyclerView.Adapter<CategoryProductParentAdapter.ProductViewHolder>() {

    class ProductViewHolder(val binding: ItemRcvCategoryBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding =
            ItemRcvCategoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val categoryModel = categoryModels[position]
        holder.binding.apply {
            tvDes.text = categoryModel.category_name
            Log.d("TAG1111", "list product ${categoryModel.products}")

            // Khởi tạo ProductAdapter với các lambda để xử lý sự kiện
            val productAdapter = ProductAdapter(
                categoryModel.products ?: emptyList(),
                itemClickListener,
                onFavoriteChanged,
                onAddToCart
            )
            rcvItemProduct.adapter = productAdapter

            tvViewMore.setOnClickListener {
            }
        }
    }

    override fun getItemCount(): Int = categoryModels.size
}