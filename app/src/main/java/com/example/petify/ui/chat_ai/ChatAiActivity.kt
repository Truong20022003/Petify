package com.example.petify.ui.chat_ai

import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.util.Log
import android.view.View
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.MainActivity
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.data.database.ModuleChat
import com.example.petify.data.database.repository.ChatRepository
import com.example.petify.data.server.enitities.APIFormatRequest
import com.example.petify.data.server.enitities.ChatAnswer
import com.example.petify.data.server.enitities.ChatRequest
import com.example.petify.databinding.ActivityChatAiBinding
import io.reactivex.rxjava3.observers.DisposableObserver
import io.reactivex.rxjava3.schedulers.Schedulers
import okhttp3.ResponseBody
import org.json.JSONObject
import java.io.IOException

class ChatAiActivity : BaseActivity<ActivityChatAiBinding, BaseViewModel>() {
    private lateinit var chatAiAdapter: ChatAiAdapter
    private lateinit var chatViewModel: ChatViewModel
    private lateinit var chatRepository: ChatRepository
    private val conversationResetDelay: Long = 30 * 60 * 1000L
    private val handler = Handler(Looper.getMainLooper())
    private val resetConversationIdRunnable = Runnable {
        chatViewModel.currentConversationId = null
        clearChatList()
    }
    private var isWaitingForResponse: Boolean = false

    private var apiUrl = "https://g7d7r69f7d.execute-api.ap-southeast-2.amazonaws.com/"
    private var apiToken = "Bearer app-ybTrxKinnjJc7dxYtDvroUu1"

    override fun createBinding() = ActivityChatAiBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()

        binding.ivBack.tap {
            finish()
        }

        chatRepository = ChatRepository(this)
        chatViewModel = ViewModelProvider(this).get(ChatViewModel::class.java)

        chatViewModel.currentConversationId = getStoredConversationId()

        chatViewModel.chatList.value =
            chatRepository.getChatsByConversationId(chatViewModel.currentConversationId.toString())
        chatAiAdapter = ChatAiAdapter(chatViewModel.chatList.value!!, binding.textViewEmpty)
        binding.recyclerViewChat.layoutManager = LinearLayoutManager(this)
        binding.recyclerViewChat.adapter = chatAiAdapter


        clearMessagesIfTimeout()
        if (chatViewModel.chatList.value!!.isEmpty()) {
            binding.textViewEmpty.visibility = View.VISIBLE
        } else {
            binding.textViewEmpty.visibility = View.GONE
        }
        binding.actionButton.setOnClickListener {
            sendMessage()
        }
        //cardViewM2
        startConversationTimeoutHandler()
        // setup icon send
        binding.editTextUserInput.addTextChangedListener { s ->
            val inputText = s.toString().trim()
            if (inputText.isNotEmpty()) {
                binding.actionButton.setImageResource(R.drawable.ic_send_on)
            } else {
                binding.actionButton.setImageResource(R.drawable.ic_send)
            }
        }

    }

    private fun clearMessagesIfTimeout() {
        val sharedPref = this.getSharedPreferences("ChatPrefs", Context.MODE_PRIVATE)
        val lastMessageTime = sharedPref.getLong("last_message_time", 0L)
        val currentTime = System.currentTimeMillis()

        if (currentTime - lastMessageTime > conversationResetDelay) {
            clearChatList()
        }
    }

    private fun updateLastMessageTime() {
        val sharedPref = this.getSharedPreferences("ChatPrefs", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putLong("last_message_time", java.lang.System.currentTimeMillis())
            apply()
        }
    }


    private fun sendMessage(message: String? = null) {
        if (isWaitingForResponse) return

        val sharedPref = this.getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
        val name = sharedPref.getString("name", "")
        val gender = sharedPref.getString("gender", "")
        val language = sharedPref.getString("language", "")
        val who = sharedPref.getString("who", "")
        val details = sharedPref.getString("details", "")
        val style = sharedPref.getString("style", "")

        val userMessageText = message ?: binding.editTextUserInput.text.toString().trim()
        val deviceId =
            Settings.Secure.getString(this.contentResolver, Settings.Secure.ANDROID_ID)

        if (userMessageText.isNotEmpty()) {
            isWaitingForResponse = true
            binding.llPleaseWait.visibility = View.VISIBLE
            val userMessage = ChatAnswer(
                createdAt = (System.currentTimeMillis() / 1000L).toString(),
                answer = userMessageText,
                conversationId = chatViewModel.currentConversationId.orEmpty(),
                isBot = false
            )

            chatViewModel.chatList.value!!.add(userMessage)
            chatRepository.insertChat(userMessage)

            if (chatViewModel.chatList.value!!.isEmpty()) {
                binding.textViewEmpty.visibility = View.VISIBLE
            } else {
                binding.textViewEmpty.visibility = View.GONE
            }

            this@ChatAiActivity.runOnUiThread {
                chatAiAdapter.notifyItemInserted(chatViewModel.chatList.value!!.size - 1)
                binding.recyclerViewChat.scrollToPosition(chatViewModel.chatList.value!!.size - 1)
            }

            val userMessageToSend = ChatRequest(
                inputs = APIFormatRequest(
                    name = name.toString(),
                    gender = gender.toString(),
                    field = "",
                    description = "",
                    language = "vietnamese",
                    style = ""
                ),
                query = userMessageText,
                responseMode = "blocking",
                conversationId = chatViewModel.currentConversationId.orEmpty(),
                user = deviceId
            )

            val completeAnswer = StringBuilder()


            //call chat service

            ModuleChat.createChatService(apiUrl, apiToken).chatData(userMessageToSend)
                ?.subscribeOn(Schedulers.io())
                ?.observeOn(Schedulers.io()) // Switch to main thread for UI operations
                ?.subscribe(object : DisposableObserver<ResponseBody>() {
                    override fun onNext(responseBody: ResponseBody) {
                        try {
                            val responseString = responseBody.string()
                            Log.d("streaming", "onNext: $responseString")
                            val jsonObject = JSONObject(responseString)
                            val answer = jsonObject.optString("answer")
                            val conversationId = jsonObject.optString("conversation_id")
                            val botMessage = ChatAnswer(
                                createdAt = (System.currentTimeMillis() / 1000L).toString(),
                                answer = answer,
                                conversationId = conversationId.orEmpty(),
                                isBot = true
                            )


                            this@ChatAiActivity.runOnUiThread {
                                if (!isFinishing && !isDestroyed) {
                                    chatViewModel.chatList.value?.apply {
                                        add(botMessage)
                                        binding.llPleaseWait.visibility = View.INVISIBLE
                                        chatRepository.insertChat(botMessage)
                                        chatAiAdapter.notifyItemInserted(size - 1)
                                        binding.recyclerViewChat.scrollToPosition(size - 1)
                                    }
                                }
                            }
                        } catch (e: IOException) {
                            e.printStackTrace()
                            Log.e("IOException", "Error reading response: ${e.message}")
                        } finally {
                            isWaitingForResponse = false
                        }
                    }

                    override fun onError(e: Throwable) {
                        e.printStackTrace()
                        Log.d("streaming", "onError: ${e.message}")
                        isWaitingForResponse = false
                    }

                    override fun onComplete() {
                        Log.d("streaming", "onComplete")
                        isWaitingForResponse = false
                    }
                })

            binding.editTextUserInput.setText("")
            updateLastMessageTime()
            startConversationTimeoutHandler()
        }
    }


    private fun startConversationTimeoutHandler() {
        handler.removeCallbacks(resetConversationIdRunnable)
        handler.postDelayed(resetConversationIdRunnable, conversationResetDelay)
    }

    fun clearChatList() {
        chatViewModel.chatList.value!!.clear()
        chatAiAdapter.notifyDataSetChanged()
    }

    fun clearConversationId() {
        chatViewModel.chatList.value!!.clear()
        chatViewModel.currentConversationId = null
    }

    private fun getStoredConversationId(): String? {
        val sharedPref = this.getSharedPreferences("ChatPrefs", Context.MODE_PRIVATE)
        return sharedPref.getString("conversation_id", null)
    }


}