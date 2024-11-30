package com.example.petify.data.adress

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.petify.BaseViewModel
import com.example.petify.data.server.CreateInteface
import kotlinx.coroutines.launch

class AddressViewmodel : BaseViewModel() {
    private val _provinces = MutableLiveData<ProvinceResponse>()
    val provinces: LiveData<ProvinceResponse> get() = _provinces

    private val _districts = MutableLiveData<DistrictResponse>()
    val districts: LiveData<DistrictResponse> get() = _districts

    private val _wards = MutableLiveData<WardResponse>()
    val wards: LiveData<WardResponse> get() = _wards

    private val _shippingFee = MutableLiveData<Int>()
    val shippingFee: LiveData<Int> get() = _shippingFee

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun getProvinces() {
        viewModelScope.launch {
            try {
                val apiService: AdressService = CreateInteface.createServiceAdress() // Tạo service
                val addressRepository = AddressRepository(apiService) // Tạo repository
                _provinces.value = addressRepository.getProvinces().body()
            } catch (e: Exception) {
                Log.e("AddressViewModel", "Error fetching provinces", e)
                _errorMessage.value = "Error fetching provinces: ${e.message}"
            }
        }
    }

    fun getDistricts(provinceId: Int) {
        viewModelScope.launch {
            try {
                val apiService: AdressService = CreateInteface.createServiceAdress()
                val addressRepository = AddressRepository(apiService)
                _districts.value = addressRepository.getDistricts(provinceId).body()
            } catch (e: Exception) {
                Log.e("AddressViewModel", "Error fetching districts", e)
                _errorMessage.value = "Error fetching districts: ${e.message}"
            }
        }
    }

    fun getWards(districtId: Int) {
        viewModelScope.launch {
            try {
                val apiService: AdressService = CreateInteface.createServiceAdress()
                val addressRepository = AddressRepository(apiService)
                _wards.value = addressRepository.getWards(districtId).body()
            } catch (e: Exception) {
                Log.e("AddressViewModel", "Error fetching wards", e)
                _errorMessage.value = "Error fetching wards: ${e.message}"
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }


    fun calculateShippingFee(fromDistrictId: Int, toDistrictId: Int, toWardCode: String, weight: Int) {
        val request = ShippingFeeRequest(
            from_district_id = fromDistrictId,
            service_id = 53320,
            to_district_id = toDistrictId,
            to_ward_code = toWardCode,
            weight = weight
        )

        viewModelScope.launch {
            try {
                val apiService: AdressService = CreateInteface.createServiceAdress() // Tạo service
                val addressRepository = AddressRepository(apiService)
                val response = addressRepository.calculateShippingFee(request)
                if (response.isSuccessful) {
                    _shippingFee.postValue(response.body()?.data?.total)
                } else {
                    _error.postValue("Lỗi API: ${response.message()}")
                }
            } catch (e: Exception) {
                _error.postValue("Lỗi mạng: ${e.message}")
            }
        }
    }

}