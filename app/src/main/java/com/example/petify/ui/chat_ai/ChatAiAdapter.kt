package com.example.petify.ui.chat_ai

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.R
import com.example.petify.data.server.enitities.ChatAnswer
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ChatAiAdapter(
    private var chatList: List<ChatAnswer>,
    private val textViewEmptyConversation: TextView
) : RecyclerView.Adapter<ChatAiAdapter.ChatViewHolder>() {


    class ChatViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textMessageBot: TextView = itemView.findViewById(R.id.textMessageBot)
        private val textMessageUser: TextView = itemView.findViewById(R.id.textMessageUser)
        private val textTimestampBot: TextView = itemView.findViewById(R.id.textTimestampBot)
        private val textTimestampUser: TextView = itemView.findViewById(R.id.textTimestampUser)

        fun bind(message: ChatAnswer) {
            textMessageBot.visibility = View.GONE
            textTimestampBot.visibility = View.GONE
            textMessageUser.visibility = View.GONE
            textTimestampUser.visibility = View.GONE

            if (message.isBot) {
                textMessageBot.text = message.answer
                textTimestampBot.text = formatTimestamp(message.createdAt)
                textMessageBot.visibility = View.VISIBLE
                textTimestampBot.visibility = View.VISIBLE
            } else {
                textMessageUser.text = message.answer
                textTimestampUser.text = formatTimestamp(message.createdAt)
                textMessageUser.visibility = View.VISIBLE
                textTimestampUser.visibility = View.VISIBLE
            }
        }

        private fun formatTimestamp(timestamp: String): String {
            val time = timestamp.toLong() * 1000L
            val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
            return sdf.format(Date(time))
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.item_chat_message, parent, false)
        return ChatViewHolder(view)
    }

    override fun getItemCount(): Int {
        return chatList.size
    }

    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        val chatSummary = chatList[position]
        holder.bind(chatSummary)
    }
}