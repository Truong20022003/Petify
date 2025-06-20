package com.example.petify.ui.home

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.data.server.enitities.FavoriteResponse
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.ItemProductBinding

class ProductAdapter(
    private var productList: List<ProductModel>,
    private var favoriteList: List<FavoriteResponse>,
    private val itemClickListener: (ProductModel) -> Unit,
    private val onFavoriteChanged: (ProductModel, Boolean) -> Unit,
    private val onAddToCart: (ProductModel, Boolean) -> Unit,
) : RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {

    class ProductViewHolder(val binding: ItemProductBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemProductBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }
    fun fillData(newProductList: List<ProductModel>) {
        this.productList = newProductList
        notifyDataSetChanged() // Cập nhật lại RecyclerView khi dữ liệu thay đổi
    }
    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = productList[position]
        // Kiểm tra trạng thái yêu thích từ danh sách favoriteList
        val isFavorite = favoriteList.any { it.productId.id == product.id }
//        Log.d("TAG1111", "Url ${product.image[0]}")

        holder.binding.ivFavorite.setImageResource(
            if (isFavorite) R.drawable.ic_love_item_home else R.drawable.ic_love_favorites_off
        )

        holder.binding.ivFavorite.tap {
            val newFavoriteStatus = !isFavorite
            onFavoriteChanged(product, newFavoriteStatus)
            notifyItemChanged(position) // Cập nhật trạng thái icon
        }
        holder.binding.apply {
            val imageUrl = product.image[0]

            if (imageUrl.isNotEmpty()) {

                Glide.with(holder.binding.root.context)
                    .load(imageUrl)
                    .into(ivProductImage)
            } else {
                ivProductImage.setImageResource(R.drawable.img_item_sp1)
            }
            tvProductName.text = product.name
            tvDiscount.text = "${product.sale} %"
            val originalPrice = product.price * (1 - product.sale / 100.0)

            Log.d("TAG2003","sale ${product.sale} price ${product.price} originalPrice $originalPrice quantity: ${product.quantity} ")
            tvSalePrice.text = "${originalPrice.toInt()} đ"
            tvOriginalPrice.apply { text = "${product.price.toInt()} đ"
                paintFlags = paintFlags or android.graphics.Paint.STRIKE_THRU_TEXT_FLAG }
            tvSold.text = "Còn lại ${product.quantity}"
            if (product.quantity == 0) {
                ivCart.isEnabled = false
                ivCart.alpha = 0.5f
            } else {
                ivCart.isEnabled = true
                ivCart.alpha = 1.0f
            }
//            ivFavorite.tap {
//                // Đổi trạng thái yêu thích (toggle)
////                val newIsFavorite = !isFavorite
//                // Gọi hàm xử lý thay đổi trạng thái yêu thích
//                onFavoriteChanged(product, !isFavorite)
//                notifyItemChanged(position) // Cập nhật trạng thái icon
//                // Gọi callback để thêm/xóa yêu thích
////                val isFavorite = ivFavorite.tag == true
////
////                onFavoriteChanged(product, !isFavorite)
////                ivFavorite.tag = !isFavorite
//
//            }

            ivCart.tap {
                onAddToCart(product, true)
            }
            holder.itemView.tap {
                itemClickListener(product)
            }
        }
    }

    override fun getItemCount(): Int = productList.size
}

