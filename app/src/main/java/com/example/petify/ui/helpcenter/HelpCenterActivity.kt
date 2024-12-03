package com.example.petify.ui.helpcenter

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.databinding.ActivityHelpCenterBinding

class HelpCenterActivity : BaseActivity<ActivityHelpCenterBinding, BaseViewModel>() {
    override fun createBinding(): ActivityHelpCenterBinding {
        return ActivityHelpCenterBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    override fun initView() {
        super.initView()
        binding.imgBack.tap {
            finish()
        }
    }
}