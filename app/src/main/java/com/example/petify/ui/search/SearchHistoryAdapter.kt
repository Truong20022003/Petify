package com.example.petify.ui.search

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.databinding.ItemSearchHistoryBinding

class SearchHistoryAdapter(
    private var searchHistory: List<String>,
    private val onItemClick: (String) -> Unit,
    private val onDeleteClick: (String) -> Unit // Hàm callback để xóa mục
) : RecyclerView.Adapter<SearchHistoryAdapter.HistoryViewHoler>() {

    inner class HistoryViewHoler(val binding: ItemSearchHistoryBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(query: String) {
            binding.tvHistory.text = query
            binding.root.setOnClickListener {
                onItemClick(query)
            }
            binding.ivDelete.setOnClickListener {
                onDeleteClick(query) // Gọi hàm xóa khi người dùng bấm vào nút delete
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HistoryViewHoler {
        val binding =
            ItemSearchHistoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return HistoryViewHoler(binding)
    }

    override fun getItemCount(): Int = searchHistory.size

    override fun onBindViewHolder(holder: HistoryViewHoler, position: Int) {
        val currentQuery = searchHistory[position]
        holder.bind(currentQuery)
    }

    fun updateData(newHistory: List<String>) {
        searchHistory = newHistory
        notifyDataSetChanged()
    }
}
