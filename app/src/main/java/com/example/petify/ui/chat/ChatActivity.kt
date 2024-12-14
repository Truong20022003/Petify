package com.example.petify.ui.chat

import android.content.Intent
import androidx.core.widget.addTextChangedListener
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.MainActivity
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.databinding.ActivityChatBinding

class ChatActivity : BaseActivity<ActivityChatBinding, BaseViewModel>() {
    override fun createBinding() = ActivityChatBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()


    override fun initView() {
        super.initView()

        binding.ivBack.tap {
            finish()
        }
        binding.ivHome.tap {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        // setup icon send
        binding.editTextUserInput.addTextChangedListener { s ->
            val inputText = s.toString().trim()
            if (inputText.isNotEmpty()) {
                binding.actionButton.setImageResource(R.drawable.ic_send_on)
            } else {
                binding.actionButton.setImageResource(R.drawable.ic_send)
            }
        }
    }
}