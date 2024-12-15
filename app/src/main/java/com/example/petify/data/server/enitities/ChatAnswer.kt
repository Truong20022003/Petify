package com.example.petify.data.server.enitities

class ChatAnswer (
    val createdAt: String,
    var answer: String,
    val conversationId: String,
    val isBot: Boolean
)