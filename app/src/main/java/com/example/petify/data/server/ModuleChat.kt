package com.example.petify.data.server

import com.example.petify.data.server.service.ChatService
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.adapter.rxjava3.RxJava3CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory

object ModuleChat {

    fun createChatService(apiUrl: String, apiToken: String): ChatService {
        val interceptor = Interceptor { chain ->
            val request = chain.request()
            val builder = request.newBuilder()
            builder.addHeader("Authorization", apiToken)
            chain.proceed(builder.build())
        }

        val okBuilder = OkHttpClient.Builder().addInterceptor(interceptor)
        return Retrofit.Builder()
            .baseUrl(apiUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .addCallAdapterFactory(RxJava3CallAdapterFactory.create())
            .client(okBuilder.build())
            .build()
            .create(ChatService::class.java)
    }
}