package com.example.petify.ui.productdetail

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.data.server.enitities.ReviewModelResult
import com.example.petify.databinding.ItemReviewBinding

class ReviewAdapter(private var reviewList: List<ReviewModelResult>) :
    RecyclerView.Adapter<ReviewAdapter.ReviewViewHolder>() {

    inner class ReviewViewHolder(val binding: ItemReviewBinding) :
        RecyclerView.ViewHolder(binding.root) {
    }

    fun fillData(newReviewList: List<ReviewModelResult>) {
        reviewList = newReviewList // Cập nhật danh sách
        notifyDataSetChanged() // Làm mới RecyclerView
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReviewViewHolder {
        val binding = ItemReviewBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ReviewViewHolder(binding)
    }

    override fun getItemCount(): Int = reviewList.size

    override fun onBindViewHolder(holder: ReviewViewHolder, position: Int) {
        val review = reviewList[position]
        holder.binding.apply {
            // Hiển thị tên người dùng
            tvNameUser.text = review.user_id.name


            // Hiển thị bình luận
            tvComment.text = review.comment

            // Hiển thị đánh giá (rating)
            ratingBar.rating = review.rating.toFloat()

            // Hiển thị ảnh đại diện
            val avatarUrl = review.user_id.avata
            if (avatarUrl.isNotEmpty()) {
                Glide.with(root.context)
                    .load(avatarUrl)
                    .into(ivUser)
            } else {
                ivUser.setImageResource(R.drawable.img_splash)
            }
        }
    }
}