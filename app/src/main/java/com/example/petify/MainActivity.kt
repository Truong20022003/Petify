package com.example.petify

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.viewpager2.widget.ViewPager2
import com.example.petify.databinding.ActivityMainBinding
import com.example.petify.view.tap

class MainActivity : BaseActivity<ActivityMainBinding, BaseViewModel>() {
    override fun createBinding() = ActivityMainBinding.inflate(layoutInflater)

    override fun setViewModel()= BaseViewModel()

    override fun initView() {
        super.initView()

        val mainAdapter = MainAdapter(this)
        binding.viewPager.adapter = mainAdapter
        binding.viewPager.offscreenPageLimit = 5
        binding.viewPager.isUserInputEnabled = false

        binding.viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {

            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)


                //data process
                when (position) {
                    0 -> {
//                        binding.fragmentNameTextView.setText(R.string.app_name)
                        setDefault()
                        binding.ivHome.setColorFilter(getColor(R.color.primaryColor))
                    }

                    1 -> {
//                        binding.fragmentNameTextView.setText(R.string.customization)
                        setDefault()
                        binding.ivCart.setColorFilter(getColor(R.color.primaryColor))
                    }

                    2 -> {
//                        binding.fragmentNameTextView.setText(R.string.historynav)
                        setDefault()
                        binding.ivLove.setColorFilter(getColor(R.color.primaryColor))
                    }

                    3 -> {
//                        binding.fragmentNameTextView.setText(R.string.settingnav)
                        setDefault()
                        binding.ivFavorite.setColorFilter(getColor(R.color.primaryColor))
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
        binding.btnLove.tap {
            binding.viewPager.currentItem = 2
        }
        binding.btnFavorite.tap {
            binding.viewPager.currentItem = 3
        }
    }

    private fun setDefault() {
        binding.ivHome.setColorFilter(getColor(R.color.color_C3C4C4))
        binding.ivCart.setColorFilter(getColor(R.color.color_C3C4C4))
        binding.ivLove.setColorFilter(getColor(R.color.color_C3C4C4))
        binding.ivFavorite.setColorFilter(getColor(R.color.color_C3C4C4))
    }


}