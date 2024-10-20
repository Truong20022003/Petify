package com.example.petify.ui.productdetail

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.databinding.ItemProductImageBinding

class ProductDetail_ImageAdapter(private val imageUrls: List<String>) :
    RecyclerView.Adapter<ProductDetail_ImageAdapter.ImageViewHolder>() {

    inner class ImageViewHolder(val binding: ItemProductImageBinding) :
        RecyclerView.ViewHolder(binding.root) {
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ImageViewHolder {
        val binding =
            ItemProductImageBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ImageViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ImageViewHolder, position: Int) {
        val imageUrl = imageUrls[position]
        Log.d("TAG1111", imageUrl)
        // Sử dụng Glide để tải ảnh từ URL
        Glide.with(holder.binding.imageView)
            .load(imageUrl)    // URL của hình ảnh
            .into(holder.binding.imageView) // ImageView để hiển thị ảnh

    }

    override fun getItemCount() = imageUrls.size
}
