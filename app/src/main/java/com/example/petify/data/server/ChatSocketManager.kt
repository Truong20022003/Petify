package com.example.petify.data.server

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

object ChatSocketManager {
    private lateinit var socket: Socket

    fun initializeSocket() {
        try {
            socket = IO.socket("http://192.168.50.48:3000") // Địa chỉ server
            socket.connect()
        } catch (e: Exception) {
            Log.e("ChatSocketManager", "Lỗi khi kết nối socket: ${e.message}")
        }
    }

    fun isConnected(): Boolean = socket.connected()

    fun sendMessage(user_id: String, sender: String, content: String) {
        if (socket != null && socket!!.connected()) {
            val messageData = JSONObject().apply {
                put("user_id", user_id)
                put("sender", sender)
                put("content", content)
            }

            socket!!.emit("sendMessage", messageData)
            Log.d("ChatSocketManager", "Message sent: $messageData")
        } else {
            Log.e("ChatSocketManager", "Socket is not connected")
        }
    }

    fun onMessageReceived(callback: (String, String, String) -> Unit) {
        socket?.on("receiveMessage") { args ->
            if (args.isNotEmpty()) {
                val data = args[0] as JSONObject
                val user_id = if (data.has("user_id")) data.getString("user_id") else null
                val sender = if (data.has("sender")) data.getString("sender") else ""
                val content = if (data.has("content")) data.getString("content") else ""
                Log.d("ChatSocketManager", "Message received: user_id=$user_id, sender=$sender, content=$content")
                if (user_id != null) {
                    callback(user_id, sender, content)
                } else {
                    Log.e("ChatSocketManager", "user_id not found in JSON")
                }
            } else {
                Log.e("ChatSocketManager", "No data received")
            }
        }

    }


    fun disconnectSocket() {
        socket.disconnect()
    }
}