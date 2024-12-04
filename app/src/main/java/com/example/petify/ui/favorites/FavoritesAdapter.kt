package com.example.petify.ui.favorites

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.data.server.enitities.FavoriteResponse
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.ItemFavoritesBinding


class FavoritesAdapter(
    private val productList: List<ProductModel>,
    private val favoriteList: List<FavoriteResponse>,
    private val itemClickListener: (ProductModel) -> Unit,
    private val onFavoriteChanged: (ProductModel, Boolean) -> Unit
) : RecyclerView.Adapter<FavoritesAdapter.FavoritesViewHolder>() {

    class FavoritesViewHolder(val binding: ItemFavoritesBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FavoritesViewHolder {
        val binding =
            ItemFavoritesBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return FavoritesViewHolder(binding)
    }

    override fun getItemCount(): Int {
        return productList.size
    }

    override fun onBindViewHolder(holder: FavoritesViewHolder, position: Int) {
        val product = productList[position]

        // Kiểm tra nếu sản phẩm có trong danh sách yêu thích từ API
        val isFavorite = favoriteList.any { it.productId.id == product.id }

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
            tvSalePrice.text = "${product.price} đ"
            tvOriginalPrice.apply {
                text = "${product.price} đ"
                paintFlags = paintFlags or android.graphics.Paint.STRIKE_THRU_TEXT_FLAG
            }
            tvSold.text = "Đã bán ${product.quantity}"

            ivFavorite.setImageResource(
                if (isFavorite) R.drawable.ic_love_favorites_off else R.drawable.ic_love_item_home
            )

            ivFavorite.setOnClickListener {
                onFavoriteChanged(product, !isFavorite)
            }

            holder.itemView.setOnClickListener {
                itemClickListener(product)
            }
        }
    }
}
