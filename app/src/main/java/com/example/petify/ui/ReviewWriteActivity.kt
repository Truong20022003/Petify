package com.example.petify.ui.review

import android.text.Editable
import android.text.TextWatcher
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.databinding.ActivityWriteReviewBinding

class ReviewWriteActivity : BaseActivity<ActivityWriteReviewBinding, BaseViewModel>() {
    override fun createBinding(): ActivityWriteReviewBinding {
        return ActivityWriteReviewBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    override fun initView() {
        super.initView()
        binding.edtContent.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {}

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
                val length=p0?.length?:0
                binding.tvCharCount.text="$length/300"
                if (length>=300){
                    binding.tvCharCount.setTextColor(resources.getColor(R.color.color_red))
                }else{
                    binding.tvCharCount.setTextColor(resources.getColor(R.color.black))
                }
            }

            override fun afterTextChanged(p0: Editable?) {

            }

        })
    }
}