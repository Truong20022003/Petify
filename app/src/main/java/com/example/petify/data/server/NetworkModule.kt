package com.example.petify.data.server

import com.example.petify.ultils.Constans
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class NetworkModule<T>(
private val url: String
) {
    fun create(className: Class<T>): T{
        val client = createClient()
        return Retrofit.Builder()
            .baseUrl(url)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(className)
    }

    private fun createClient(): OkHttpClient {
        val logger = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC }

        val headerInterceptor = Interceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader(Constans.API_NAME, Constans.API_KEY)
                .build()
            chain.proceed(request)
        }

        return OkHttpClient.Builder()
            .addInterceptor(headerInterceptor)
            .addInterceptor(logger)
            .connectTimeout(Constans.TIME_OUT, TimeUnit.SECONDS)
            .readTimeout(Constans.TIME_OUT, TimeUnit.SECONDS)
            .writeTimeout(Constans.TIME_OUT, TimeUnit.SECONDS)
            .build()
    }

}