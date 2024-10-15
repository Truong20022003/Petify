package com.example.petify.ui.intro

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup

import androidx.recyclerview.widget.RecyclerView
import com.example.petify.databinding.ItemIntroBinding
import com.example.petify.model.IntroModel

class ViewPagerAdapter(val list: MutableList<IntroModel>) :
    RecyclerView.Adapter<ViewPagerAdapter.ViewHoler>() {

    inner class ViewHoler(val binding: ItemIntroBinding):RecyclerView.ViewHolder(binding.root){
        fun bind(data:IntroModel){
            try {
                binding.ivIntro.setImageResource(data.image)
                binding.tvTitle.setText(data.title)
                binding.tvContent.setText(data.content)
            } catch (_: Exception) {

            }
        }

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHoler {
        val binding=ItemIntroBinding.inflate(LayoutInflater.from(parent.context),parent,false)
        return ViewHoler(binding)
    }

    override fun getItemCount(): Int =list.size

    override fun onBindViewHolder(holder: ViewHoler, position: Int) {
        val currenItem=list[position]
        holder.bind(currenItem)
    }
}