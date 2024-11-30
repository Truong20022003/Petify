package com.example.petify.ui.cart

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.databinding.ItemCartBinding

class CartAdapter(
    private var cartList: List<CartItem>,
    private val onTotalPriceUpdated: (Double) -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

     val selectedItems = mutableSetOf<CartItem>() // Track selected items
    private val selectedcarts = HashMap<String, Boolean>()

    fun updateItems(newItems: List<CartItem>) {
        cartList = newItems
        notifyDataSetChanged()
        calculateTotalPrice()
    }
    fun getSelectedItems(): List<CartItem> {
        return selectedItems.toList()
    }

    inner class CartViewHolder(val binding: ItemCartBinding) : RecyclerView.ViewHolder(binding.root) {

        fun bind(cart: CartItem) {
            binding.apply {
                val imageUrl = cart.image[0]
                if (imageUrl.isNotEmpty()) {
                    Glide.with(binding.root.context)
                        .load(imageUrl)
                        .into(ivSp)
                } else {
                    ivSp.setImageResource(R.drawable.img_item_sp1)
                }
                ivNameSp.text = cart.name
                ivTypeSp.text = "${cart.date}"
                ivPriceSp.text = "${cart.price} VND"
                tvQuantity.text = cart.quantity.toString()
                ivAddition.setOnClickListener {
                    cart.quantity++
                    tvQuantity.text = cart.quantity.toString()
                    notifyItemChanged(position)
                }

                ivSubtraction.setOnClickListener {
                    if (cart.quantity > 0) {
                        cart.quantity--
                        tvQuantity.text = cart.quantity.toString()
                        notifyItemChanged(position)
                    }
                }
                
               val isSelected = selectedcarts[cart.id] ?: false
                ivCheck.setImageResource(if (isSelected) R.drawable.ic_check_cart_on else R.drawable.ic_check_cart_off)

                binding.ivCheck.setOnClickListener {
                    if (selectedItems.contains(cart)) {
                        selectedItems.remove(cart)
                        binding.ivCheck.setImageResource(R.drawable.ic_check_cart_off)
                    } else {
                        selectedItems.add(cart)
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

    override fun getItemCount(): Int = cartList.size

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        holder.bind(cartList[position])
    }

    private fun calculateTotalPrice() {
        val totalPrice = selectedItems.sumOf { it.price * it.quantity }
        onTotalPriceUpdated(totalPrice)
    }

    fun setAllSelected(isSelected: Boolean) {
        cartList.forEach { cart ->
            selectedcarts[cart.id] = isSelected
        }
        notifyDataSetChanged()
        calculateTotalPrice()
        updateTotalPrice()
    }

    fun updateTotalPrice() {
        var totalPrice = 0.0
        for (cart in cartList) {
            if (selectedcarts[cart.id] == true) {
                totalPrice += cart.price * cart.quantity
            }
        }
        onTotalPriceUpdated(totalPrice)
    }
    fun getTotalPrice(): Double {
        return selectedItems.sumOf { it.price * it.quantity }
    }

}