package com.example.petify.ui.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.R

class Home_SlideshowAdapter(private val images: List<Int>) :
    RecyclerView.Adapter<Home_SlideshowAdapter.SlideshowViewHolder>() {

    class SlideshowViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imageView: ImageView = itemView.findViewById(R.id.imageView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SlideshowViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.item_home_slideshow, parent, false)
        return SlideshowViewHolder(view)
    }

    override fun onBindViewHolder(holder: SlideshowViewHolder, position: Int) {
        val imageRes = images[position] ?: R.drawable.img_slide2
        holder.imageView.setImageResource(imageRes)
        holder.imageView.setImageResource(images[position])
    }

    override fun getItemCount(): Int = images.size
}
