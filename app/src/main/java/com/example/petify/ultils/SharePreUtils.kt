package com.example.petify.ultils

import android.content.Context
import android.content.SharedPreferences
import com.example.petify.data.server.enitities.UserModel
import com.google.gson.Gson

object SharePreUtils {
    private const val PREF_NAME = "PetifyPreferences"
    private const val USER_KEY = "UserModel"

    private fun getSharedPreferences(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    fun setUserModel(context: Context, userModel: UserModel) {
        val sharedPreferences = getSharedPreferences(context)
        val editor = sharedPreferences.edit()
        val userJson = Gson().toJson(userModel)
        editor.putString(USER_KEY, userJson)
        editor.apply()
    }

    fun getUserModel(context: Context): UserModel? {
        val sharedPreferences = getSharedPreferences(context)
        val userJson = sharedPreferences.getString(USER_KEY, null)
        return if (userJson != null) {
            Gson().fromJson(userJson, UserModel::class.java)
        } else {
            null
        }
    }

    fun clearUserModel(context: Context) {
        val sharedPreferences = getSharedPreferences(context)
        val editor = sharedPreferences.edit()
        editor.remove(USER_KEY)
        editor.apply()
    }
}