package com.example.petify.ui.invoice_history

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.databinding.ItemRvCategoryBinding

class CategoryOrderAdapter(
    private val list: List<String>,
    private val onClick: (position: Int) -> Unit
) : RecyclerView.Adapter<CategoryOrderAdapter.ViewHodel>() {
    private var selectedPosition = 0

    inner class ViewHodel(val binding: ItemRvCategoryBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHodel {

        return ViewHodel(
            ItemRvCategoryBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )

    }

    override fun getItemCount(): Int {
        return list.size
    }

    override fun onBindViewHolder(holder: ViewHodel, position: Int) {
        if (position == selectedPosition) {
            holder.binding.btnCategory.backgroundTintList = ContextCompat.getColorStateList(holder.itemView.context, R.color.darkblueBlack)
            holder.binding.btnCategory.setTextColor(ContextCompat.getColor(holder.itemView.context, R.color.white))
        } else {
            holder.binding.btnCategory.backgroundTintList = ContextCompat.getColorStateList(holder.itemView.context, R.color.switch_unchecked_color)
            holder.binding.btnCategory.setTextColor(ContextCompat.getColor(holder.itemView.context, R.color.white))
        }
        holder.binding.btnCategory.text = list[position]
        holder.binding.root.tap {
            val previousPosition = selectedPosition
            selectedPosition = position
            notifyItemChanged(previousPosition)
            notifyItemChanged(selectedPosition)
            onClick(position)
        }


    }
}