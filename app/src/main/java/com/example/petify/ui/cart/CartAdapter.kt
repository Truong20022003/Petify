package com.example.petify.ui.cart

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.databinding.ItemCartBinding
interface OnQuantityChangeListener {
    fun onQuantityUpdated(cart: CartResponse)
}

class CartAdapter(
    private var cartList: List<CartResponse>,
    private val onTotalPriceUpdated: (Double) -> Unit,
    private val onQuantityChangeListener: OnQuantityChangeListener
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

     val selectedItems = mutableSetOf<CartResponse>()
    private val selectedcarts = HashMap<String, Boolean>()

    fun updateItems(newItems: List<CartResponse>) {
        cartList = newItems
        notifyDataSetChanged()
        calculateTotalPrice()
    }
    fun getSelectedItems(): List<CartResponse> {
        return selectedItems.toList()
    }

    inner class CartViewHolder(val binding: ItemCartBinding) : RecyclerView.ViewHolder(binding.root) {

        fun bind(cart: CartResponse) {
            binding.apply {
                val imageUrl = cart.productId.image[0]
                if (imageUrl.isNotEmpty()) {
                    Glide.with(binding.root.context)
                        .load(imageUrl)
                        .into(ivSp)
                } else {
                    ivSp.setImageResource(R.drawable.img_item_sp1)
                }
                ivNameSp.text = cart.productId.name
                ivTypeSp.text = "${cart.productId.date}"
                ivPriceSp.text = "${(cart.productId.price*cart.quantity).toInt()} VND"
                tvQuantity.text = cart.quantity.toString()

                ivAddition.setOnClickListener {
                    cart.quantity++
                    tvQuantity.text = cart.quantity.toString()
                    notifyItemChanged(position)
                    // Cập nhật số lượng trong ViewModel hoặc API
                    onQuantityChangeListener.onQuantityUpdated(cart)
                }

                ivSubtraction.setOnClickListener {
                    if (cart.quantity > 1) {
                        cart.quantity--
                        tvQuantity.text = cart.quantity.toString()
                        notifyItemChanged(position)
                        onQuantityChangeListener.onQuantityUpdated(cart)
                    } else if (cart.quantity == 1) {
                        // Khi số lượng là 0, xóa sản phẩm khỏi giỏ hàng
                        cart.quantity = 0
                        tvQuantity.text = "0"
                        onQuantityChangeListener.onQuantityUpdated(cart) // Xóa sản phẩm khỏi giỏ hàng
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
        val totalPrice = selectedItems.sumOf { it.productId.price * it.quantity }
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
                totalPrice += cart.productId.price * cart.quantity
            }
        }
        onTotalPriceUpdated(totalPrice)
    }
    fun getTotalPrice(): Double {
        return selectedItems.sumOf { it.productId.price * it.quantity }
    }

}