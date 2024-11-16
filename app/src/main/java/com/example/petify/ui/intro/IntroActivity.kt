package com.example.petify.ui.intro

import android.content.Intent
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.viewpager2.widget.ViewPager2
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.ui.signup.SignupActivity
import com.example.petify.databinding.ActivityIntroBinding
import com.example.petify.model.IntroModel
import com.example.petify.ui.login.LoginActivity
import com.example.petify.ui.zalopay.ZalopayMainActivity

class IntroActivity : BaseActivity<ActivityIntroBinding, BaseViewModel> () {


    var isFirst = true
    private lateinit var dots: Array<ImageView?>
    private lateinit var viewPagerAdapter: ViewPagerAdapter
    private val myPageChangeCallback: ViewPager2.OnPageChangeCallback =
        object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                if (isFirst) {
                    isFirst = false
                    return
                }
                addBottomDots(position)
                if (position == countPageIntro - 1) {
                    binding.btnNext.setText(R.string.bat_dau)
                } else {
                    binding.btnNext.setText(R.string.tiep_theo)
                }
            }
        }
    private val countPageIntro = 3

    override fun createBinding(): ActivityIntroBinding {
        return ActivityIntroBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }


    override fun initView() {
        super.initView()
        val data = mutableListOf(
            IntroModel(
                R.drawable.img_intro1,
                R.string.title_intro_1,
                R.string.content_intro_1
            ),
            IntroModel(
                R.drawable.img_intro2,
                R.string.title_intro_2,
                R.string.content_intro_2
            ),
            IntroModel(
                R.drawable.img_intro3,
                R.string.title_intro_3,
                R.string.content_intro_3
            )
        )
        viewPagerAdapter = ViewPagerAdapter( data)
        binding.viewPager2.apply {
            adapter = viewPagerAdapter
            registerOnPageChangeCallback(myPageChangeCallback)
        }
        addBottomDots(0)

        binding.btnNext.setOnClickListener {
            if (binding.viewPager2.currentItem == countPageIntro - 1) {
                it.isEnabled = false
                startNextScreen()
            } else
                binding.viewPager2.currentItem = binding.viewPager2.currentItem + 1
            if (binding.viewPager2.currentItem == countPageIntro - 1) {
                binding.btnNext.setText(R.string.bat_dau)
            } else {
                binding.btnNext.setText(R.string.tiep_theo)
            }
        }
    }



    private fun startNextScreen() {
        var intent = Intent(this, ZalopayMainActivity::class.java)
        startActivity(intent)
        finishAffinity()
    }

    private fun addBottomDots(currentPage: Int) {
        binding.linearDots.removeAllViews()
        for (i in 0 until countPageIntro) {
            val dot = ImageView(this).apply {
                setImageResource(if (i == currentPage) R.drawable.icon_intro_selected else R.drawable.icon_intro_not_selected)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { setMargins(8, 0, 8, 0) }
            }
            binding.linearDots.addView(dot)
        }
    }

}