package com.example.petify.data.database.repository

import android.content.ContentValues
import android.content.Context
import com.example.petify.data.database.ChatDatabase
import com.example.petify.data.server.enitities.ChatAnswer

class ChatRepository(context: Context) {

    private val dbHelper = ChatDatabase(context)
    private val db = dbHelper.writableDatabase
    fun insertChat(chatAnswer: ChatAnswer) {
        val values = ContentValues().apply {
            put("message", chatAnswer.answer)
            put("is_bot", if (chatAnswer.isBot) 1 else 0)
            put("timestamp", chatAnswer.createdAt)
            put("conversation_id", chatAnswer.conversationId)
        }
        db.insert("chat_history", null, values)
    }

    fun getAllChats(): List<ChatAnswer> {
        val chatList = mutableListOf<ChatAnswer>()
        val cursor = db.query(
            "chat_history",
            null, null, null, null, null, null
        )
        with(cursor) {
            while (moveToNext()) {
                val message = getString(getColumnIndexOrThrow("message"))
                val isBot = getInt(getColumnIndexOrThrow("is_bot")) == 1
                val timestamp = getString(getColumnIndexOrThrow("timestamp"))
                val conversationId =
                    getString(getColumnIndexOrThrow("conversation_id"))
                chatList.add(ChatAnswer(timestamp, message, conversationId, isBot))
            }
            close()
        }
        return chatList
    }

    fun deleteAllChats() {
        db.delete("chat_history", null, null)
    }

    fun getChatsByConversationId(conversationId: String): MutableList<ChatAnswer> {
        val chatList = mutableListOf<ChatAnswer>()
        val cursor = db.query(
            "chat_history",
            null,
            "conversation_id = ?",
            arrayOf(conversationId),
            null, null, null
        )
        with(cursor) {
            while (moveToNext()) {
                val message = getString(getColumnIndexOrThrow("message"))
                val isBot = getInt(getColumnIndexOrThrow("is_bot")) == 1
                val timestamp = getString(getColumnIndexOrThrow("timestamp"))
                chatList.add(ChatAnswer(timestamp, message, conversationId, isBot))
            }
            close()
        }
        return chatList
    }


}