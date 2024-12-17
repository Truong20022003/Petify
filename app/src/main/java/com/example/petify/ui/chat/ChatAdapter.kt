package com.example.petify.ui.chat

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.R
import com.example.petify.data.server.repository.MessageModel

class ChatAdapter(private val messages: List<MessageModel>) :
    RecyclerView.Adapter<ChatAdapter.ChatViewHolder>() {

    inner class ChatViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvMessageContent: TextView = view.findViewById(R.id.tvMessageContent)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_chat, parent, false)
        return ChatViewHolder(view)
    }

    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        val message = messages[position]
        holder.tvMessageContent.text = message.content

        val layoutParams = holder.itemView.layoutParams as ViewGroup.MarginLayoutParams
        if (message.sender == "user") {
            layoutParams.marginStart = 50
            layoutParams.marginEnd = 10
            holder.itemView.setBackgroundResource(R.drawable.bg_item_menu_off) // Thay bằng background tùy chỉnh
        } else {
            layoutParams.marginStart = 10
            layoutParams.marginEnd = 50
            holder.itemView.setBackgroundResource(R.drawable.bg_bot_message) // Thay bằng background tùy chỉnh
        }
        holder.itemView.layoutParams = layoutParams
    }

    override fun getItemCount(): Int = messages.size
}
