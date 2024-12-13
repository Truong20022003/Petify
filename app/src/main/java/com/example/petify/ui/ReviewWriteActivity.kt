package com.example.petify.ui.review

import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.widget.Toast
import androidx.lifecycle.ViewModelProvider
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.data.server.enitities.ReviewModelRequest
import com.example.petify.databinding.ActivityWriteReviewBinding
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.InvoiceDetailViewModel
import com.example.petify.viewmodel.ReviewViewModel

class ReviewWriteActivity : BaseActivity<ActivityWriteReviewBinding, ReviewViewModel>() {
    override fun createBinding(): ActivityWriteReviewBinding {
        return ActivityWriteReviewBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): ReviewViewModel {
        return ReviewViewModel()
    }

    override fun initView() {
        super.initView()

        binding.textView3.tap {
            val userModel = SharePreUtils.getUserModel(this)
            val idProduct = intent.getStringExtra("idProduct")
            val comment = binding.edtContent.text.toString()
            val rating = binding.ratingBar.rating.toInt()
            Log.d("RATING","rating: $rating comment: $comment idProduct: $idProduct idUser: ${userModel!!.id}")
            if (rating == 0) {
                Toast.makeText(this, "Vui lòng đánh giá", Toast.LENGTH_SHORT)
                    .show()
                return@tap
            }
            val reviewRequest = ReviewModelRequest(
                rating,
                comment,
                userModel.id,
                idProduct.toString()
            )
            viewModel.addReview(reviewRequest)
            viewModel.isReviewAdded.observe(this) {
                if (it) {
                    Toast.makeText(this, "Đánh giá thành công", Toast.LENGTH_SHORT).show()
                    finish()
                }
            }
        }
        binding.edtContent.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {}

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
                val length = p0?.length ?: 0
                binding.tvCharCount.text = "$length/300"
                if (length >= 300) {
                    binding.tvCharCount.setTextColor(resources.getColor(R.color.color_red))
                } else {
                    binding.tvCharCount.setTextColor(resources.getColor(R.color.black))
                }
            }

            override fun afterTextChanged(p0: Editable?) {

            }

        })
    }
}