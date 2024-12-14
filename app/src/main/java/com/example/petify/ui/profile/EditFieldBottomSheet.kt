package com.example.petify.ui.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.example.petify.databinding.BottomSheetEditUserBinding
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class EditFieldBottomSheet(
    private val fieldName: String,
    private val tvValues: String,
    private val onSave: (String) -> Unit
) : BottomSheetDialogFragment() {

    private lateinit var binding: BottomSheetEditUserBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = BottomSheetEditUserBinding.inflate(inflater, container, false)
        initView()
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val bottomSheetBehavior = BottomSheetBehavior.from(view.parent as View)
        bottomSheetBehavior.isDraggable = false
        isCancelable = false  // Không cho đóng bằng cách chạm ngoài BottomSheet
    }

    private fun initView() {
        binding.edtContent.setText(tvValues)
        binding.tvTitle.text = fieldName
        binding.tvClose.setOnClickListener {
            dismiss()
        }
        binding.tvCheckSussess.setOnClickListener {
            val updatedValue = binding.edtContent.text.toString()

            if (validateField(fieldName, updatedValue)) {
                onSave(updatedValue)
                dismiss()
            } else {
                binding.edtContent.error = "Giá trị $fieldName không hợp lệ"
                binding.edtContent.requestFocus()
            }
        }
    }

    private fun validateField(fieldName: String, value: String): Boolean {
        return when (fieldName) {
            "Họ tên" -> {
                if (value.isEmpty() || value.length < 3) {
                    binding.edtContent.error = "Họ tên phải có ít nhất 3 ký tự"
                    false
                } else true
            }

            "Email" -> {
                if (!android.util.Patterns.EMAIL_ADDRESS.matcher(value).matches()) {
                    binding.edtContent.error = "Email không hợp lệ"
                    false
                } else true
            }

            "Số điện thoại" -> {
                if (!value.matches(Regex("^[0-9]{10,11}$"))) {
                    binding.edtContent.error = "Số điện thoại phải gồm 10 hoặc 11 chữ số"
                    false
                } else true
            }

            "Địa chỉ" -> {
                if (value.isEmpty()) {
                    binding.edtContent.error = "Địa chỉ không được để trống"
                    false
                } else true
            }

            else -> true
        }
    }
}
