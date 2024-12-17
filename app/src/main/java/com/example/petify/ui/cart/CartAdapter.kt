package com.example.petify.ui.cart

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.data.database.enitities.CartItem
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.databinding.ItemCartBinding
import java.text.DecimalFormat
import java.text.NumberFormat
import java.util.Locale

interface OnQuantityChangeListener {
    fun onQuantityUpdated(cart: CartResponse)
}

class CartAdapter(
    private var cartList: List<CartResponse>,
    private val onTotalPriceUpdated: (Double) -> Unit,
    private val onQuantityChangeListener: OnQuantityChangeListener,
    private val onCheckAllStateChanged: (Boolean) -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

    val selectedItems = mutableSetOf<CartResponse>()
    private var isAllSelected = false
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
                ivPriceSp.text = "${formatPrice(cart.productId.price)} VND"
                val originalPrice =  cart.productId.price * (1 - (cart.productId.sale / 100.0))
                ivPriceSpSale.text = "${formatPrice((originalPrice*cart.quantity))} VND"
                tvQuantity.text = cart.quantity.toString()

                // Cập nhật trạng thái nút tích chọn
                val isSelected = selectedItems.contains(cart)
                ivCheck.setImageResource(if (isSelected) R.drawable.ic_check_cart_on else R.drawable.ic_check_cart_off)


                ivAddition.tap {
                    cart.quantity++
                    tvQuantity.text = cart.quantity.toString()
                    notifyItemChanged(position) // Cập nhật lại giao diện
                    onQuantityChangeListener.onQuantityUpdated(cart) // Gửi sự kiện cập nhật số lượng
                    // Không reset trạng thái "được chọn"
                    notifyItemChanged(position)
                    calculateTotalPrice() // Tính lại tổng tiền
                }

                ivSubtraction.tap {
                    if (cart.quantity > 1) {
                        cart.quantity--
                        tvQuantity.text = cart.quantity.toString()
                        notifyItemChanged(position) // Cập nhật lại giao diện
                        onQuantityChangeListener.onQuantityUpdated(cart) // Gửi sự kiện cập nhật số lượng
                        // Không reset trạng thái "được chọn"
                        notifyItemChanged(position)
                        calculateTotalPrice() // Tính lại tổng tiền
                    } else if (cart.quantity == 1) {
                        // Nếu số lượng giảm về 0, có thể xóa sản phẩm khỏi danh sách
                        cart.quantity = 0
                        tvQuantity.text = "0"
                        notifyItemChanged(position) // Cập nhật lại giao diện
                        onQuantityChangeListener.onQuantityUpdated(cart) // Gửi sự kiện cập nhật số lượng
                        // Không reset trạng thái "được chọn"
                        notifyItemChanged(position)
                        calculateTotalPrice() // Tính lại tổng tiền
                    }
                }
                binding.ivCheck.tap {
                    if (selectedItems.contains(cart)) {
                        selectedItems.remove(cart)
                        binding.ivCheck.setImageResource(R.drawable.ic_check_cart_off)
                    } else {
                        selectedItems.add(cart)
                        binding.ivCheck.setImageResource(R.drawable.ic_check_cart_on)
                    }
                    calculateTotalPrice()

                    // Kiểm tra trạng thái checkAll
                    val isAllSelected = selectedItems.size == cartList.size
                    onCheckAllStateChanged(isAllSelected) // Gửi trạng thái về Fragment
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
        val totalPrice = selectedItems.sumOf { (it.productId.price * (1 - (it.productId.sale / 100.0))) * it.quantity }
        onTotalPriceUpdated(totalPrice)
    }

    fun formatPrice(price: Double): String {
        val formatter = NumberFormat.getNumberInstance(Locale("vi", "VN")) // Định dạng kiểu Việt Nam
        return formatter.format(price)
    }

    fun setAllSelected(isSelected: Boolean) {
        selectedItems.clear() // Xóa danh sách hiện tại
        if (isSelected) {
            selectedItems.addAll(cartList) // Thêm tất cả các item vào danh sách đã chọn
        }
        updateTotalPrice()
        notifyDataSetChanged()
        calculateTotalPrice()

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
        return selectedItems.sumOf { (it.productId.price * (1 - (it.productId.sale / 100.0))) * it.quantity }
    }

}