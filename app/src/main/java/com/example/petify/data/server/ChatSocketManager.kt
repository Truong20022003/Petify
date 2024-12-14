package com.example.petify.data.server

import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

object ChatSocketManager {
    private lateinit var socket: Socket

    fun initializeSocket() {
        socket = IO.socket("http://your-server-ip:3000") // Địa chỉ server
        socket.connect()
    }

    fun isConnected(): Boolean = socket.connected()

    fun sendMessage(userId: String, sender: String, content: String) {
        val message = JSONObject()
        message.put("user_id", userId)
        message.put("sender", sender)
        message.put("content", content)

        socket.emit("send_message", message)
    }

    fun onMessageReceived(callback: (userId: String, sender: String, content: String) -> Unit) {
        socket.on("receive_message") { args ->
            if (args.isNotEmpty()) {
                val data = args[0] as JSONObject
                val userId = data.getString("user_id")
                val sender = data.getString("sender")
                val content = data.getString("content")
                callback(userId, sender, content)
            }
        }
    }

    fun disconnectSocket() {
        socket.disconnect()
    }
}