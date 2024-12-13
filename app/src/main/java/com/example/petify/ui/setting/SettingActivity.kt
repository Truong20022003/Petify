package com.example.petify.ui.setting

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.data.server.enitities.UserModel
import com.example.petify.databinding.ActivitySettingBinding
import com.example.petify.ui.helpcenter.HelpCenterActivity
import com.example.petify.ui.privacypolicy.PrivacyPolicyActivity
import com.example.petify.ui.profile.ProfileActivity
import com.example.petify.ultils.SharePreUtils

class SettingActivity : BaseActivity<ActivitySettingBinding, BaseViewModel>() {

    override fun createBinding(): ActivitySettingBinding {
        return ActivitySettingBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    override fun initView() {
        super.initView()
        val userModel = SharePreUtils.getUserModel(this)
        userModel?.let { updateUI(it) }
        binding.icProfile.setOnClickListener {
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
        }
        binding.imgBack.setOnClickListener {
            finish()
        }
        binding.icPrivacyPolicy.setOnClickListener {
            val intent = Intent(this, PrivacyPolicyActivity::class.java)
            startActivity(intent)
        }
        binding.icHelpCenter.setOnClickListener {
            val intent = Intent(this, HelpCenterActivity::class.java)
            startActivity(intent)
        }
    }
    override fun onResume() {
        super.onResume()
        val updatedUser = SharePreUtils.getUserModel(this)
        if (updatedUser != null) {
            updateUI(updatedUser)
        }
    }
    private fun updateUI(updatedUser: UserModel) {
        binding.tvUsername.text=updatedUser?.user_name
        binding.tvEmail.text=updatedUser?.email
        Glide.with(this)
            .load(updatedUser?.avata)
            .placeholder(R.drawable.img_loading)
            .error(R.drawable.image_default)
            .fitCenter()
            .into(binding.ivAvtProfile)
    }
}