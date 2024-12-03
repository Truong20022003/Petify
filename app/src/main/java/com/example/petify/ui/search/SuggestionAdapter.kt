package com.example.petify.ui.search

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.databinding.ItemSearchHistoryBinding
import com.example.petify.databinding.ItemSearchSuggestionBinding


class SuggestionAdapter(
    private var suggestions: List<String>,
    private val onItemClick: (String) -> Unit
) : RecyclerView.Adapter<SuggestionAdapter.SuggestionViewHolder>() {

    inner class SuggestionViewHolder(private val binding: ItemSearchSuggestionBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(suggestion: String) {
            binding.tvSuggestion.text = suggestion
            binding.root.setOnClickListener { onItemClick(suggestion) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SuggestionViewHolder {
        val binding = ItemSearchSuggestionBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return SuggestionViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SuggestionViewHolder, position: Int) {
        holder.bind(suggestions[position])
    }
    fun updateData(newSuggestions: List<String>) {
        suggestions=newSuggestions
        notifyDataSetChanged()
    }
    override fun getItemCount(): Int = suggestions.size
}
