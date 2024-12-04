package com.example.petify.payment.zalopay

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.RemoteViews
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.MainActivity
import com.example.petify.R
import com.example.petify.data.server.enitities.OrderModel
import com.example.petify.databinding.ActivityPaymentNotificationBinding
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.UserViewModel

class PaymentNotificationActivity :
    BaseActivity<ActivityPaymentNotificationBinding, BaseViewModel>() {

    private val CHANNEL_ID = "custom_notification_channel"
    private val NOTIFICATION_ID = 1
    private lateinit var userViewModel: UserViewModel
    override fun createBinding() = ActivityPaymentNotificationBinding.inflate(layoutInflater)

    override fun setViewModel() = BaseViewModel()


    override fun initView() {
        super.initView()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 101)
            }
        }
        binding.btnOrder.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }
        createNotificationChannel()
        userViewModel = ViewModelProvider(this)[UserViewModel::class.java]
        val userId = SharePreUtils.getUserModel(this)!!.id
        userViewModel.getUserById(userId)

        userViewModel.user.observe(this) { user ->
            binding.tvName.text = user?.name
            binding.tvPhonenumber.text = user?.phoneNumber
            binding.tvAddress.text = user?.location
        }
        binding.tvTextTitle.text = intent.getStringExtra("result")
        val order = intent.getSerializableExtra("order") as? OrderModel
        val carMethod = intent.getStringExtra("carMethod")
        binding.tvPTVT.text = carMethod.toString()
        binding.tvPPTT.text = order?.paymentMethod.toString()
        binding.tvPrice1.text = order?.code.toString()
        binding.tvPrice.text = order?.totalPrice.toString()
        binding.tvShippingFee.text = order?.shippingFee.toString()
        binding.tvTotalPrice.text = order?.totalPrice.toString()

        showCustomNotification()
    }


    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Custom Notification"
            val descriptionText = "Channel for custom notifications"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }

            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun showCustomNotification() {
        val customView = RemoteViews(packageName, R.layout.item_popup_noti_small)
        customView.setTextViewText(R.id.notification_title, "Petify")
        customView.setTextViewText(R.id.notification_message, "Đơn hàng đã đặt thành công")

        val customBigView = RemoteViews(packageName, R.layout.item_popup_noti_big)
        customBigView.setTextViewText(R.id.notification_large_title, "Petify")
        customBigView.setTextViewText(
            R.id.notification_large_message,
            "Đơn hàng đã đặt thành công, đang chờ xử lý"
        )
        customBigView.setImageViewResource(R.id.notification_image, R.drawable.img_slide3)

        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent: PendingIntent = PendingIntent.getActivity(
            this, 0, intent, PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setCustomContentView(customView)
            .setCustomBigContentView(customBigView)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()



        Log.d("Notification", "Notification built")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 101)
        }

        with(NotificationManagerCompat.from(this)) {
            notify(NOTIFICATION_ID, notification)
            Log.d("Notification", "Notification posted")
        }


    }
}