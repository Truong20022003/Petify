package com.example.petify.data.server

import android.util.Log
import com.example.petify.ultils.Constans
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

object ChatSocketManager {
    private lateinit var socket: Socket

    fun initializeSocket(user_id: String) {
        try {
            socket = IO.socket(Constans.DOMAIN_SOCKET)
            socket.connect()
            socket.on(Socket.EVENT_CONNECT) {
                Log.d("ChatSocketManager", "Socket connected: ${socket.id()}")
                socket.emit("register", user_id)
            }
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
    fun joinRoom(user_id: String) {
        if (socket.connected()) {
            socket.emit("register", user_id)
            Log.d("ChatSocketManager", "Joined room: $user_id")
        } else {
            Log.e("ChatSocketManager", "Socket not connected")
        }
    }

    fun onMessageReceived(callback: (String, String, String) -> Unit) {
        socket?.on("receiveMessage") { args ->
            if (args.isNotEmpty()) {
                val data = args[0] as JSONObject
                Log.d("ChatSocketManager", "Received data: $data")
                val user_id = data.optString("user_id")
                val sender = data.optString("sender")
                val content = data.optString("content")
                callback(user_id, sender, content)
            } else {
                Log.e("ChatSocketManager", "No data received")
            }
        }
    }



    fun disconnectSocket() {
        socket.disconnect()
    }
}