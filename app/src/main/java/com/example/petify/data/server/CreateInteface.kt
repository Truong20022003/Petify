package com.example.petify.data.server

import com.example.petify.ultils.Constans


object CreateInteface {
    inline fun <reified T> createService(): T {
        return NetworkModule<T>(Constans.DOMAIN).create(T::class.java)
    }
}