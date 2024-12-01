package com.example.petify.ui.payment

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.data.server.enitities.CarrierModel
import com.example.petify.databinding.ItemRvCarrierBinding

class CarrierAdapter(
    private val list: List<CarrierModel>,
    private val onClick: (CarrierModel) -> Unit
) : RecyclerView.Adapter<CarrierAdapter.ViewHolder>() {

    inner class ViewHolder( val binding: ItemRvCarrierBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(ItemRvCarrierBinding.inflate(LayoutInflater.from(parent.context), parent, false))
    }

    override fun getItemCount(): Int {
        return  list.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.binding.apply {
            tvNameCarrier.text = list[position].name
//            tvCarrierPrice.text = list[position].price
            root.setOnClickListener {
                onClick(list[position])
            }
        }
    }
}