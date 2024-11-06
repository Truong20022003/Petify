package com.example.petify.ui.home

import android.text.SpannableString
import android.text.style.UnderlineSpan
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.R

class MenuProductAdapter (
    private val menuList: List<String>
) : RecyclerView.Adapter<MenuProductAdapter.MenuViewHolder>()  {

    private var selectedPosition: Int = RecyclerView.NO_POSITION

    class MenuViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvMenuItem: TextView = itemView.findViewById(R.id.tv_menu_item)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MenuViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_menu_product, parent, false)
        return MenuViewHolder(view)
    }

    override fun getItemCount(): Int {
        return menuList.size
    }

    override fun onBindViewHolder(holder: MenuViewHolder, position: Int) {
        holder.tvMenuItem.text = menuList[position]

        // Gạch chân text nếu item này được chọn
        if (position == selectedPosition) {
            val spannable = SpannableString(holder.tvMenuItem.text)
            spannable.setSpan(UnderlineSpan(), 0, spannable.length, 0)
            holder.tvMenuItem.text = spannable
        } else {
            holder.tvMenuItem.text = menuList[position] // Hiển thị bình thường nếu không được chọn
        }

        // Thiết lập sự kiện click cho item
        holder.itemView.setOnClickListener {
            // Cập nhật vị trí được chọn
            selectedPosition = position
            notifyDataSetChanged() // Cập nhật lại RecyclerView
        }

    }

}