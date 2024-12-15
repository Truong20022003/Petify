package com.example.petify.ui.helpcenter

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.base.view.tap
import com.example.petify.databinding.ActivityHelpCenterBinding
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions


class HelpCenterActivity : BaseActivity<ActivityHelpCenterBinding, BaseViewModel>(),
    OnMapReadyCallback {
    private val location = "26 Ng. 38 P. Yên Lãng, Láng Hạ, Đống Đa, Hà Nội"
    private val latLng = LatLng(21.01345, 105.81702)
    private lateinit var mMap: GoogleMap
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

        val mapFragment = binding.mapFragment as? SupportMapFragment
        mapFragment?.getMapAsync(this)
        binding.xemtrongbando.setOnClickListener {
            if (isGoogleMapsAvailable()) {
                openGoogleMaps()
            } else {
                Toast.makeText(
                    this,
                    "Google Maps không có sẵn trên thiết bị này",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }


    // Kiểm tra xem Google Maps có sẵn trên thiết bị không
    private fun isGoogleMapsAvailable(): Boolean {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=$location"))
        intent.setPackage("com.google.android.apps.maps")
        return intent.resolveActivity(this.packageManager) != null
    }

    // Mở Google Maps với địa chỉ cụ thể
    private fun openGoogleMaps() {
        val geoUri = Uri.parse("geo:0,0?q=$location")
        val mapIntent = Intent(Intent.ACTION_VIEW, geoUri)
        mapIntent.setPackage("com.google.android.apps.maps")

        startActivity(mapIntent)
    }


    // Phương thức riêng để thiết lập bản đồ
    private fun setupMap() {
        // Thêm Marker vào bản đồ tại vị trí đã chỉ định
        mMap.addMarker(MarkerOptions().position(latLng).title("Vị trí của bạn"))

        // Di chuyển camera đến vị trí đó và zoom vào
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, 15f))
    }

    override fun onMapReady(p0: GoogleMap) {
        mMap = p0

        // Gọi phương thức riêng để thiết lập bản đồ
        setupMap()
    }
}