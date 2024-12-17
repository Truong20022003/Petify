package com.example.petify.ui.payment

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.R
import com.example.petify.data.server.enitities.CarrierModel
import com.example.petify.databinding.ItemRvCarrierBinding
class CarrierAdapter(
    private var list: MutableList<CarrierModel>,
    private val onClick: (CarrierModel, String) -> Unit
) : RecyclerView.Adapter<CarrierAdapter.ViewHolder>() {

    private var selectedPosition: Int = RecyclerView.NO_POSITION // Lưu vị trí item được chọn

    inner class ViewHolder(val binding: ItemRvCarrierBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(ItemRvCarrierBinding.inflate(LayoutInflater.from(parent.context), parent, false))
    }

    override fun getItemCount(): Int {
        return list.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.binding.apply {
            tvNameCarrier.text = list[position].name
            val price = if (position == 0) {
                "10.000đ"
            } else {
                "20.000đ"
            }
            tvCarrierPrice.text = price

            // Hiển thị icon tùy thuộc vào trạng thái được chọn
            ivSelector.setImageResource(
                if (position == selectedPosition) R.drawable.ic_payment_selected
                else R.drawable.ic_payment
            )

            root.setOnClickListener {
                // Cập nhật vị trí được chọn
                val previousPosition = selectedPosition
                selectedPosition = position

                // Cập nhật giao diện
                notifyItemChanged(previousPosition) // Cập nhật item trước đó
                notifyItemChanged(selectedPosition) // Cập nhật item hiện tại

                // Gọi callback onClick
                onClick(list[position], price)
            }
        }
    }

    // Hàm fillData để cập nhật dữ liệu
    fun fillData(newList: List<CarrierModel>) {
        list.clear()            // Xóa danh sách cũ
        list.addAll(newList)    // Thêm danh sách mới
        selectedPosition = RecyclerView.NO_POSITION // Reset trạng thái chọn
        notifyDataSetChanged()  // Thông báo RecyclerView cập nhật lại dữ liệu
    }
}
