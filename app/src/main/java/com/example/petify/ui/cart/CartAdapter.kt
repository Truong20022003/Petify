package com.example.petify.ui.cart

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.databinding.ItemCartBinding
import com.example.petify.model.ProductModel

class CartAdapter(
    private var productList: List<CartItem>,
    private val onTotalPriceUpdated: (Int) -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

    private val selectedItems = mutableSetOf<CartItem>() // Track selected items
    private val selectedProducts = HashMap<String, Boolean>()

    fun updateItems(newItems: List<CartItem>) {
        productList = newItems
        notifyDataSetChanged() // Or use DiffUtil for better performance
        calculateTotalPrice()  // Recalculate the total price after updating the list
    }
    inner class CartViewHolder(val binding: ItemCartBinding) : RecyclerView.ViewHolder(binding.root) {

        fun bind(product: CartItem) {
            binding.apply {
                val imageUrl = product.image[0]
                if (imageUrl.isNotEmpty()) {
                    Glide.with(binding.root.context)
                        .load(imageUrl)
                        .into(ivSp)
                } else {
                    ivSp.setImageResource(R.drawable.img_item_sp1)
                }
                ivNameSp.text = product.name
                ivTypeSp.text = "${product.date}"
                ivPriceSp.text = "${product.price} VND"
                tvQuantity.text = product.quantity.toString()
                ivAddition.setOnClickListener {
                    product.quantity++
                    tvQuantity.text = product.quantity.toString()
                    notifyItemChanged(position)
                }

                ivSubtraction.setOnClickListener {
                    if (product.quantity > 0) {
                        product.quantity--
                        tvQuantity.text = product.quantity.toString()
                        notifyItemChanged(position)
                    }
                }
                // Check the selected state from the HashMap
                val isSelected = selectedProducts[product.id] ?: false
                ivCheck.setImageResource(if (isSelected) R.drawable.ic_check_cart_on else R.drawable.ic_check_cart_off)

                binding.ivCheck.setOnClickListener {
                    if (selectedItems.contains(product)) {
                        selectedItems.remove(product)
                        binding.ivCheck.setImageResource(R.drawable.ic_check_cart_off)
                    } else {
                        selectedItems.add(product)
                        binding.ivCheck.setImageResource(R.drawable.ic_check_cart_on)
                    }
                    calculateTotalPrice()
                }
            }
        }


    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val binding = ItemCartBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CartViewHolder(binding)
    }

    override fun getItemCount(): Int = productList.size

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        holder.bind(productList[position])
    }

    private fun calculateTotalPrice() {
        val totalPrice = selectedItems.sumOf { it.price * it.quantity }
        onTotalPriceUpdated(totalPrice)
    }

    fun setAllSelected(isSelected: Boolean) {
        productList.forEach { product ->
            selectedProducts[product.id] = isSelected
        }
        notifyDataSetChanged()
        calculateTotalPrice()
        updateTotalPrice()
    }

    fun updateTotalPrice() {
        var totalPrice = 0
        for (product in productList) {
            if (selectedProducts[product.id] == true) {
                totalPrice += product.price * product.quantity
            }
        }
        onTotalPriceUpdated(totalPrice)
    }

}