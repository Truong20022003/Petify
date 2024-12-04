package com.example.petify.ui.payment

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.data.adress.AddressViewmodel
import com.example.petify.databinding.ActivityAddressBinding
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.ProductViewModel
import com.example.petify.viewmodel.UserViewModel

class AddressActivity : BaseActivity<ActivityAddressBinding, AddressViewmodel>() {

    private var selectedProvinceName: String? = null
    private var selectedDistrictName: String? = null
    private var selectedWardName: String? = null
    private var selectedAddressDetail: String? = null
    private var newAddress: String? = null

    private lateinit var userViewModel: UserViewModel
    override fun createBinding(): ActivityAddressBinding {
        return ActivityAddressBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): AddressViewmodel {
        return AddressViewmodel()
    }

    override fun initView() {
        super.initView()
        val userModel = SharePreUtils.getUserModel(this)
        binding.tvName.text = userModel?.name
        binding.tvPhonenumber.text = userModel?.phoneNumber
        binding.ivBack.setOnClickListener {
            finish()
        }
        userViewModel = ViewModelProvider(this)[UserViewModel::class.java]
        viewModel.getProvinces()
        viewModel.provinces.observe(this) { province ->
            Log.d("AddressActivity1111", "provinces: $province")
            val provinceList = province.data.map { it.ProvinceName }
            val provinceAdapter =
                ArrayAdapter(this, android.R.layout.simple_spinner_item, provinceList)
            provinceAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            binding.spinnerProvinces.adapter = provinceAdapter
            binding.spinnerProvinces.onItemSelectedListener =
                object : AdapterView.OnItemSelectedListener {
                    override fun onItemSelected(
                        parent: AdapterView<*>,
                        view: View,
                        position: Int,
                        id: Long
                    ) {
                        selectedProvinceName = provinceList[position]
                        updateAddress()
                        val selectedProvinceId = province.data[position].id
                        viewModel.getDistricts(selectedProvinceId.toInt())
                    }

                    override fun onNothingSelected(parent: AdapterView<*>) {}
                }
        }
        viewModel.districts.observe(this) { district ->
            Log.d("AddressActivity1111", "districts: $district")
            val districtList = district.data.map { it.DistrictName }
            val districtAdapter =
                ArrayAdapter(this, android.R.layout.simple_spinner_item, districtList)
            districtAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            binding.spinnerDistricts.adapter = districtAdapter
            binding.spinnerDistricts.onItemSelectedListener =
                object : AdapterView.OnItemSelectedListener {
                    override fun onItemSelected(
                        parent: AdapterView<*>,
                        view: View,
                        position: Int,
                        id: Long
                    ) {
                        selectedDistrictName = districtList[position]
                        updateAddress()
                        val selectedDistrictId = district.data[position].id
                        viewModel.getWards(selectedDistrictId.toInt())
                    }

                    override fun onNothingSelected(parent: AdapterView<*>) {}
                }
        }

        viewModel.wards.observe(this) { wards ->
            Log.d("AddressActivity1111", "wards: $wards")
            val wardList = wards.data.map { it.WardName }
            val wardAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, wardList)
            wardAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            binding.spinnerWards.adapter = wardAdapter
            binding.spinnerWards.onItemSelectedListener =
                object : AdapterView.OnItemSelectedListener {
                    override fun onItemSelected(
                        parent: AdapterView<*>,
                        view: View,
                        position: Int,
                        id: Long
                    ) {
                        selectedWardName = wardList[position]
                        updateAddress()
                    }

                    override fun onNothingSelected(parent: AdapterView<*>) {}
                }
        }
        binding.etAddressDetail.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                selectedAddressDetail = s.toString()
                updateAddress()
            }

            override fun afterTextChanged(s: Editable?) {}
        })
        val userId = SharePreUtils.getUserModel(this)!!.id
        binding.tvSave.setOnClickListener {
            val newAddress = newAddress
            if (newAddress!!.isNotEmpty()) {
                userViewModel.updateUserAddress(userId, newAddress)
                Toast.makeText(this, "Thay đổi địa chỉ thành công", Toast.LENGTH_SHORT).show()

                finish()
            } else {
                Toast.makeText(this, "Address cannot be empty", Toast.LENGTH_SHORT).show()
            }
        }

//        userViewModel.isUserUpdated.observe(this) { isUpdated ->
//            if (isUpdated) {
//                Toast.makeText(context, "Address updated successfully!", Toast.LENGTH_SHORT).show()
//            } else {
//                Toast.makeText(context, "Failed to update address", Toast.LENGTH_SHORT).show()
//            }
//        }


    }

    private fun updateAddress() {
        binding.tvAddress.text =
            listOfNotNull(
                selectedAddressDetail,
                selectedWardName,
                selectedDistrictName,
                selectedProvinceName
            )
                .joinToString(", ")

        newAddress =
            listOfNotNull(
                selectedAddressDetail,
                selectedWardName,
                selectedDistrictName,
                selectedProvinceName
            )
                .joinToString(", ")
    }
}