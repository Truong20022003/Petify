package com.example.petify.data.server.enitities

import com.google.gson.annotations.SerializedName

class ChatRequest (
    var inputs: APIFormatRequest,
    var query: String,
    @SerializedName("response_mode") var responseMode: String,
    @SerializedName("conversation_id") var conversationId: String,
    var user: String
)