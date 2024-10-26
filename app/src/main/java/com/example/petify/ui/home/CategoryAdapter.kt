package com.example.petify.ui.home

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.databinding.ItemRcvCategoryBinding
import com.example.petify.model.CategoryModel
import com.example.petify.model.ProductModel

class CategoryAdapter(
    private val categoryModels: List<CategoryModel>,
    private val onItemClick: (ProductModel) -> Unit
) : RecyclerView.Adapter<CategoryAdapter.ProductViewHolder>() {

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
            tvDes.text = categoryModel.product
            Log.d("TAG1111", "list product ${categoryModel.items}")

            val productAdapter =
                ProductAdapter(categoryModel.items ?: emptyList()) { selectedItem ->
                    onItemClick(selectedItem)
                }
            rvItemCategory.adapter = productAdapter

            tvViewMore.setOnClickListener {
            }
        }
    }

    override fun getItemCount(): Int = categoryModels.size
}
