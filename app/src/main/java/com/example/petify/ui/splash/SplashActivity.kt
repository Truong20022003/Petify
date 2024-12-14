package com.example.petify.ui.splash

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.MainActivity
import com.example.petify.R
import com.example.petify.ui.intro.IntroActivity
import com.google.firebase.messaging.FirebaseMessaging
import java.util.logging.Handler


class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseMessaging.getInstance().subscribeToTopic("sale_updates")
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    Log.d("FCM", "Subscribed to topic: sale_updates")
                } else {
                    Log.e("FCM", "Failed to subscribe to topic", task.exception)
                }
            }
        setContentView(R.layout.activity_splash)
        android.os.Handler().postDelayed({
            val intent = Intent(this, IntroActivity::class.java)
            startActivity(intent)
            finish()
        }, 3000)

    }
}