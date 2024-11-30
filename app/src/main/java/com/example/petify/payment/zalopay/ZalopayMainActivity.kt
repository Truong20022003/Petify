package com.example.petify.payment.zalopay

import android.content.Intent
import android.widget.Toast
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.base.view.tap
import com.example.petify.databinding.ActivityZalopayMainBinding


class ZalopayMainActivity : BaseActivity<ActivityZalopayMainBinding, BaseViewModel>() {


    override fun createBinding() = ActivityZalopayMainBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()

    override fun initView() {
        super.initView()

        binding.buttonConfirm.tap {
            val soluongText = binding.editTextSoluong.text?.toString()
            if (soluongText.isNullOrEmpty()) {
                Toast.makeText(this, "Nhập số lượng muốn mua", Toast.LENGTH_SHORT).show()
                return@tap
            }

            val soLuong = soluongText.toDoubleOrNull()
            if (soLuong == null) {
                Toast.makeText(this, "Số lượng không hợp lệ", Toast.LENGTH_SHORT).show()
                return@tap
            }

            val total = soLuong * 1000.0
            val intent = Intent(this, OrderPaymentActivity::class.java).apply {
                putExtra("soluong", soluongText)
                putExtra("total", total)
            }
            startActivity(intent)

        }

    }
}