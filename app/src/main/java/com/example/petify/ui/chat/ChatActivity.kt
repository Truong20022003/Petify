package com.example.petify.ui.chat

import android.content.Intent
import android.util.Log
import android.widget.Button
import android.widget.EditText
import androidx.core.widget.addTextChangedListener
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.MainActivity
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.data.server.ChatSocketManager
import com.example.petify.data.server.repository.MessageModel
import com.example.petify.databinding.ActivityChatBinding
import com.example.petify.ultils.SharePreUtils

class ChatActivity : BaseActivity<ActivityChatBinding, BaseViewModel>() {
    override fun createBinding() = ActivityChatBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()
    private lateinit var chatAdapter: ChatAdapter
    private val messages = mutableListOf<MessageModel>()
    override fun onResume() {
        super.onResume()
//        val userModel = SharePreUtils.getUserModel(this)
//        if (!ChatSocketManager.isConnected()) {
//            ChatSocketManager.initializeSocket(userModel!!.id)
//        }
//
//        ChatSocketManager.joinRoom(userModel!!.id)
        val userModel = SharePreUtils.getUserModel(this)
        if (!ChatSocketManager.isConnected()) {
            ChatSocketManager.initializeSocket(userModel!!.id) {
                ChatSocketManager.joinRoom(userModel.id)
                fetchChatHistory(userModel.id)
            }
        } else {
            ChatSocketManager.joinRoom(userModel!!.id)
            fetchChatHistory(userModel!!.id)
        }
    }

    override fun onPause() {
        super.onPause()
        ChatSocketManager.disconnectSocket()
    }

    override fun initView() {
        super.initView()

        val userModel = SharePreUtils.getUserModel(this)
        ChatSocketManager.initializeSocket(userModel!!.id)
        ChatSocketManager.joinRoom(userModel!!.id)
        binding.ivBack.tap {
            finish()
        }
        chatAdapter = ChatAdapter(messages)
        binding.recyclerViewChat.adapter = chatAdapter
        binding.recyclerViewChat.layoutManager = LinearLayoutManager(this)


        binding.actionButton.setOnClickListener {
            val message = binding.editTextUserInput.text.toString()
            if (message.isNotBlank()) {
                // Thêm tin nhắn của người dùng vào danh sách
                val userMessage = MessageModel(userModel!!.id, "user", message)
                messages.add(userMessage)
                chatAdapter.notifyItemInserted(messages.size - 1)
                binding.recyclerViewChat.scrollToPosition(messages.size - 1)

                // Gửi tin nhắn qua Socket
                ChatSocketManager.sendMessage(
                    user_id = userModel!!.id, // ID người dùng thực tế
                    sender = "user",
                    content = message
                )

                binding.editTextUserInput.text.clear()
            }
        }
//        ChatSocketManager.fetchChatHistory(userModel.id) { historyMessages ->
//            runOnUiThread {
//                messages.clear()
//                messages.addAll(historyMessages)
//                chatAdapter.notifyDataSetChanged()
//                if (messages.isNotEmpty()) {
//                    binding.recyclerViewChat.scrollToPosition(messages.size - 1)
//                }
//            }
//        }
        ChatSocketManager.onMessageReceived { userId, sender, content ->
            runOnUiThread {
//                if (sender.equals("Admin")) {
                if (sender != "user") {
                    val serverMessage = MessageModel(userId, sender, content)
                    messages.add(serverMessage)
                    chatAdapter.notifyItemInserted(messages.size - 1)
                    binding.recyclerViewChat.scrollToPosition(messages.size - 1)
                }
//                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        ChatSocketManager.disconnectSocket()
    }
    private fun fetchChatHistory(user_id: String) {
        ChatSocketManager.fetchChatHistory(user_id) { historyMessages ->
            runOnUiThread {
                messages.clear()
                messages.addAll(historyMessages)
                Log.d("ChatActivity", "Fetched chat history: $historyMessages")
                chatAdapter.notifyDataSetChanged()
                if (messages.isNotEmpty()) {
                    binding.recyclerViewChat.scrollToPosition(messages.size - 1)
                }
            }
        }
    }

}