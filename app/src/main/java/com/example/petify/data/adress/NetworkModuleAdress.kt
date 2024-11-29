package com.example.petify.data.adress

import com.example.petify.ultils.Constans
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class NetworkModuleAdress<T>(
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
                .addHeader("Token", "31f9eced-ace1-11ef-9834-7e8875c3faf5")
                .build()
            chain.proceed(request)
        }

        return OkHttpClient.Builder()
            .addInterceptor(headerInterceptor)
            .addInterceptor(logger)
            .readTimeout(Constans.TIME_OUT, TimeUnit.SECONDS)
            .connectTimeout(Constans.TIME_OUT, TimeUnit.SECONDS)
            .build()
    }

}