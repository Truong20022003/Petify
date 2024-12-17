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

        val cardLayoutParams = holder.itemView.findViewById<View>(R.id.cardMessage).layoutParams as androidx.constraintlayout.widget.ConstraintLayout.LayoutParams

        if (message.sender == "user") {
            // Neo tin nhắn bên phải
            cardLayoutParams.endToEnd = androidx.constraintlayout.widget.ConstraintLayout.LayoutParams.PARENT_ID
            cardLayoutParams.startToStart = -1 // Xóa ràng buộc bên trái
            holder.itemView.findViewById<View>(R.id.cardMessage).setBackgroundResource(R.drawable.bg_user_message)
        } else {
            // Neo tin nhắn bên trái
            cardLayoutParams.startToStart = androidx.constraintlayout.widget.ConstraintLayout.LayoutParams.PARENT_ID
            cardLayoutParams.endToEnd = -1 // Xóa ràng buộc bên phải
            holder.itemView.findViewById<View>(R.id.cardMessage).setBackgroundResource(R.drawable.bg_bot_message)
        }

        holder.itemView.findViewById<View>(R.id.cardMessage).layoutParams = cardLayoutParams
    }


    override fun getItemCount(): Int = messages.size
}
