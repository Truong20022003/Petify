package com.example.petify.ui.intro

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup

import androidx.recyclerview.widget.RecyclerView
import com.example.petify.base.BaseAdapter
import com.example.petify.databinding.LayoutItemIntroBinding
import com.example.petify.model.IntroModel

class ViewPagerAdapter(val context: Context, list: MutableList<IntroModel>) :
    BaseAdapter<LayoutItemIntroBinding, IntroModel>() {
    init {
        listData = list
    }

    override fun createBinding(
        inflater: LayoutInflater,
        parent: ViewGroup,
        viewType: Int
    ): LayoutItemIntroBinding = LayoutItemIntroBinding.inflate(inflater, parent, false)

    override fun createVH(binding: LayoutItemIntroBinding): RecyclerView.ViewHolder =
        IntroVH(binding)

    inner class IntroVH(binding: LayoutItemIntroBinding) : BaseVH<IntroModel>(binding) {
        override fun bind(data: IntroModel) {
            super.bind(data)
            try {
                binding.ivIntro.setImageResource(data.image)
                binding.tvTitle.setText(data.title)
                binding.tvContent.setText(data.content)
            } catch (_: Exception) {

            }
        }
    }
}