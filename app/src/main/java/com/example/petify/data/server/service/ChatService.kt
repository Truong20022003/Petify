package com.example.petify.data.server.service

import com.example.petify.data.server.enitities.ChatRequest
import io.reactivex.rxjava3.core.Observable
import okhttp3.ResponseBody
import retrofit2.http.Body
import retrofit2.http.POST

interface ChatService {
    @POST("chat-messages")
    fun chatData(@Body userMessage: ChatRequest): Observable<ResponseBody>?
}