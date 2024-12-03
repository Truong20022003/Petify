package com.example.petify.ui.profile

import android.content.Intent
import android.database.Cursor
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.data.server.enitities.UserModel
import com.example.petify.databinding.ActivityProfileBinding
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.UserViewModel
import java.io.File
import java.io.FileOutputStream

class ProfileActivity : BaseActivity<ActivityProfileBinding, BaseViewModel>() {
    private val pickImageRequestCode = 1001
    private lateinit var userViewModel: UserViewModel
    private var selectedImageFile: File? = null

    override fun createBinding(): ActivityProfileBinding {
        return ActivityProfileBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    override fun initView() {
        super.initView()
        userViewModel = ViewModelProvider(this)[UserViewModel::class.java]
        val userModel = SharePreUtils.getUserModel(this)
        Log.d("Profile", "----${userModel}")
        setUserDetails(userModel)
        binding.tvBack.setOnClickListener {
            finish()
        }
        binding.ivEditAvatar.setOnClickListener {
            pickImageFromGallery()
        }

        binding.tvName.setOnClickListener {
            showEditFieldBottomSheet("Họ tên", binding.tvName.text.toString()) { newName ->
                binding.tvName.text = newName
            }
        }


        binding.tvEmail.setOnClickListener {
            showEditFieldBottomSheet("Email", binding.tvEmail.text.toString()) { newEmail ->
                binding.tvEmail.text = newEmail
            }
        }


        binding.tvPhonenumber.setOnClickListener {
            showEditFieldBottomSheet(
                "Số điện thoại",
                binding.tvPhonenumber.text.toString()
            ) { newPhone ->
                binding.tvPhonenumber.text = newPhone
            }
        }


        binding.tvAddress.setOnClickListener {
            showEditFieldBottomSheet("Địa chỉ", binding.tvAddress.text.toString()) { newAddress ->
                binding.tvAddress.text = newAddress
            }
        }

        binding.tvSave.setOnClickListener {
            binding.progressBar.visibility = View.VISIBLE

            val updatedUser = userModel?.id?.let { userId ->
                UserModel(
                    id = userId,
                    name = binding.tvName.text.toString(),
                    email = binding.tvEmail.text.toString(),
                    phoneNumber = binding.tvPhonenumber.text.toString(),
                    location = binding.tvAddress.text.toString(),
                    password = userModel.password,
                    user_name = userModel.user_name,
                )
            }

            if (updatedUser != null) {
                userViewModel.updateUser(
                    id = updatedUser.id,
                    user = updatedUser,
                    avataFile = selectedImageFile
                )
                userViewModel.isUserUpdated.observe(this) { isUpdated ->
                    if (isUpdated) {
                        binding.progressBar.visibility = View.GONE
                        userViewModel.user.observe(this) { user ->
                            Log.d("TAONE", "User--------: $user")
                            user?.let { it1 -> SharePreUtils.setUserModel(this, it1) }
                            setUserDetails(user)
                        }

                        Toast.makeText(
                            this,
                            "Cập nhật thành công!",
                            Toast.LENGTH_SHORT
                        ).show()
                        finish()
                    } else {
                        Toast.makeText(
                            this,
                            "Cập nhật thất bại. Vui lòng thử lại!",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            } else {
                binding.progressBar.visibility = View.GONE
                Toast.makeText(this, "Không thể cập nhật thông tin", Toast.LENGTH_SHORT).show()
            }
        }

    }

    private fun pickImageFromGallery() {
        val intent = Intent(Intent.ACTION_PICK).apply {
            type = "image/*"
        }
        startActivityForResult(intent, pickImageRequestCode)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == pickImageRequestCode && resultCode == RESULT_OK) {
            val imageUri = data?.data
            if (imageUri != null) {
                val imageFile = uriToFile(imageUri)
                if (imageFile != null) {
                    updateAvatar(imageFile)
                } else {
                    Toast.makeText(this, "Không thể chuyển đổi ảnh thành tệp", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        }
    }

    private fun uriToFile(uri: Uri): File? {
        return try {
            val inputStream = contentResolver.openInputStream(uri)
            val tempFile = File.createTempFile("avatar_", ".jpg", cacheDir)
            val outputStream = FileOutputStream(tempFile)

            inputStream?.use { input ->
                outputStream.use { output ->
                    input.copyTo(output)
                }
            }
            tempFile
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    private fun updateAvatar(imageFile: File) {
        Glide.with(this)
            .load(imageFile)
            .placeholder(R.drawable.img_loading)
            .error(R.drawable.img_avt_profile)
            .fitCenter()
            .into(binding.imgProfile)

        selectedImageFile = imageFile
    }


    private fun setUserDetails(userModel: UserModel?) {
        if (userModel != null) {
            binding.tvName.text = userModel.name
            binding.tvEmail.text = userModel.email
            binding.tvPhonenumber.text = userModel.phoneNumber
            binding.tvAddress.text = userModel.location
            Glide.with(this)
                .load(userModel.avata)
                .placeholder(R.drawable.img_loading)
                .error(R.drawable.img_avt_profile)
                .fitCenter()
                .into(binding.imgProfile)
        } else {
            binding.tvName.setText("Chưa có dữ liệu")
            binding.tvEmail.setText("Chưa có dữ liệu")
            binding.tvPhonenumber.setText("Chưa có dữ liệu")
            binding.tvAddress.setText("Chưa có dữ liệu")
        }
    }

    private fun showEditFieldBottomSheet(
        fieldName: String,
        fieldValue: String,
        onSave: (String) -> Unit
    ) {
        val bottomSheet = EditFieldBottomSheet(fieldName, fieldValue, onSave)
        bottomSheet.show(supportFragmentManager, "EditFieldBottomSheet")
    }
}