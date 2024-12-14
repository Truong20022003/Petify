package com.example.petify.ui.splash

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.petify.R
import com.example.petify.ui.intro.IntroActivity
import com.google.firebase.messaging.FirebaseMessaging

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        subscribeToTopics()
        setContentView(R.layout.activity_splash)
        android.os.Handler().postDelayed({
            val intent = Intent(this, IntroActivity::class.java)
            startActivity(intent)
            finish()
        }, 3000)
    }

    private fun subscribeToTopics() {
        val topics = listOf("sale_updates", "status_order") // Danh sách các topic
        for (topic in topics) {
            FirebaseMessaging.getInstance().subscribeToTopic(topic)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        Log.d("FCM", "Subscribed to topic: $topic")
                    } else {
                        Log.e("FCM", "Failed to subscribe to topic: $topic", task.exception)
                    }
                }
        }
    }
}
