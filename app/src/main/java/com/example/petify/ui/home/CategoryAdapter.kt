package com.example.petify.ui.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.data.server.enitities.CategoryModel
import com.example.petify.databinding.ItemRvCategoryBinding
import com.example.petify.base.view.tap

class CategoryAdapter(
    private val categoryModels: List<CategoryModel>,
    private val itemClickListener: (CategoryModel) -> Unit
) : RecyclerView.Adapter<CategoryAdapter.ProductViewHolder>() {

    class ProductViewHolder(val binding: ItemRvCategoryBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding =
            ItemRvCategoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val categoryModel = categoryModels[position]
        holder.binding.apply {
            btnCategory.text = categoryModel.name
            root.tap {
                itemClickListener(categoryModel)
            }
        }
    }

    override fun getItemCount(): Int = categoryModels.size
}
