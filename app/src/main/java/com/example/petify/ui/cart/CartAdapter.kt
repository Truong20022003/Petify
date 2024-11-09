package com.example.petify.ui.cart

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.databinding.ItemCartBinding
import com.example.petify.model.ProductModel

class CartAdapter(
    private val productList: List<ProductModel>,
    private val onTotalPriceUpdated: (Int) -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

    private val selectedItems = mutableSetOf<ProductModel>() // Track selected items
    private val selectedProducts = HashMap<String, Boolean>()


    inner class CartViewHolder(val binding: ItemCartBinding) : RecyclerView.ViewHolder(binding.root) {

        fun bind(product: ProductModel) {
            binding.apply {
                val imageUrl = product.image[0]
                // Load image using Glide
                if (imageUrl.isNotEmpty()) {
                    Glide.with(binding.root.context)
                        .load(imageUrl)
                        .into(ivSp)
                } else {
                    ivSp.setImageResource(R.drawable.img_item_sp1)
                }
                // Bind product data to views
                ivNameSp.text = product.name
                ivTypeSp.text = "${product.date}"
                ivPriceSp.text = "${product.price} VND"
                tvQuantity.text = product.quantity.toString() // Assuming there's a quantity field in ProductModel

                // Set click listeners for addition and subtraction buttons
                ivAddition.setOnClickListener {
                    product.quantity++ // Increment quantity
                    tvQuantity.text = product.quantity.toString() // Update UI
                    notifyItemChanged(position) // Notify adapter about the change
                }

                ivSubtraction.setOnClickListener {
                    if (product.quantity > 0) { // Prevent negative quantity
                        product.quantity-- // Decrement quantity
                        tvQuantity.text = product.quantity.toString() // Update UI
                        notifyItemChanged(position) // Notify adapter about the change
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
        // Calculate total price for selected items
        val totalPrice = selectedItems.sumOf { it.price * it.quantity }
        onTotalPriceUpdated(totalPrice) // Send total price back to fragment
    }

    // Function to select or deselect all products
    fun setAllSelected(isSelected: Boolean) {
        productList.forEach { product ->
            selectedProducts[product.id] = isSelected
        }
        notifyDataSetChanged() // Refresh all items in the adapter
        calculateTotalPrice() // Update total price
        updateTotalPrice()
    }

    fun updateTotalPrice() {
        var totalPrice = 0
        for (product in productList) {
            if (selectedProducts[product.id] == true) {
                totalPrice += product.price * product.quantity // Assuming quantity is in the model
            }
        }
        onTotalPriceUpdated(totalPrice) // Call the lambda to update the total price
    }

}