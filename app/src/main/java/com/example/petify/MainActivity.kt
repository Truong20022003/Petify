package com.example.petify

import android.util.Log
import androidx.viewpager2.widget.ViewPager2
import com.example.petify.databinding.ActivityMainBinding
import com.example.petify.base.view.tap
import com.example.petify.ultils.SharePreUtils
import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : BaseActivity<ActivityMainBinding, BaseViewModel>() {

    override fun createBinding() = ActivityMainBinding.inflate(layoutInflater)
    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()
        subscribeToTopics()
        val mainAdapter = MainAdapter(this)
        binding.viewPager.adapter = mainAdapter
        binding.viewPager.offscreenPageLimit = 4
        binding.viewPager.isUserInputEnabled = false

        binding.viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {

            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)
                when (position) {
                    0 -> {
                        setDefault()
                        binding.ivHome.setColorFilter(getColor(R.color.black))
                    }

                    1 -> {
                        setDefault()
                        binding.ivCart.setColorFilter(getColor(R.color.black))
                    }

                    2 -> {
                        setDefault()
                        binding.ivFavorite.setColorFilter(getColor(R.color.black))
                    }

                    3 -> {
                        setDefault()
                        binding.ivInvoice.setColorFilter(getColor(R.color.black))
                    }
                }
            }
        })

        binding.btnHome.tap {
            binding.viewPager.currentItem = 0
        }
        binding.btnCart.tap {
            binding.viewPager.currentItem = 1
        }
        binding.btnFavorite.tap {
            binding.viewPager.currentItem = 2
        }
        binding.btnProfile.tap {
            binding.viewPager.currentItem = 3
        }
    }

    private fun setDefault() {
        binding.ivHome.setColorFilter(getColor(R.color.color_ffa7a7ac))
        binding.ivCart.setColorFilter(getColor(R.color.color_ffa7a7ac))
        binding.ivFavorite.setColorFilter(getColor(R.color.color_ffa7a7ac))
        binding.ivInvoice.setColorFilter(getColor(R.color.color_ffa7a7ac))
    }


    private fun subscribeToTopics() {

        val userModel = SharePreUtils.getUserModel(this)
        val topic = userModel!!.id
        if (topic != null){
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