package com.example.petify.ui.chat_ai

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.petify.data.server.enitities.ChatAnswer


class ChatViewModel : ViewModel() {
    val chatList: MutableLiveData<MutableList<ChatAnswer>> by lazy {
        MutableLiveData<MutableList<ChatAnswer>>(ArrayList())
    }
    var currentConversationId: String? = null

}
