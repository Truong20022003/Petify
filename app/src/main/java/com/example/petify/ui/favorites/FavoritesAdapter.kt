package com.example.petify.ui.favorites

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.petify.R
import com.example.petify.base.view.tap
import com.example.petify.data.server.enitities.CartResponse
import com.example.petify.data.server.enitities.FavoriteResponse
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.ItemFavoritesBinding


class FavoritesAdapter(
    private var favoriteList: MutableList<FavoriteResponse>,// Danh sách có thể thay đổi để cho phép sửa đổi
    private val itemClickListener: (ProductModel) -> Unit,
    private val onFavoriteChanged: (ProductModel, Boolean) -> Unit
) : RecyclerView.Adapter<FavoritesAdapter.FavoritesViewHolder>() {

    val selectedItems = mutableSetOf<FavoriteResponse>()

    fun updateItems(newItems: List<FavoriteResponse>) {
        favoriteList = newItems.toMutableList() //Cập nhật danh sách dưới dạng có thể thay đổi
        notifyDataSetChanged()
    }

    fun getSelectedItems(): List<FavoriteResponse> {
        return selectedItems.toList()
    }

    class FavoritesViewHolder(val binding: ItemFavoritesBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FavoritesViewHolder {
        val binding =
            ItemFavoritesBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return FavoritesViewHolder(binding)
    }

    override fun getItemCount(): Int {
        return favoriteList.size
    }

    override fun onBindViewHolder(holder: FavoritesViewHolder, position: Int) {
        val product = favoriteList[position]

//        // Kiểm tra nếu sản phẩm có trong danh sách yêu thích từ API
        val isFavorite = favoriteList.any { it.productId.id == product.id }
        holder.binding.apply {
            val imageUrl = product.productId.image[0]
            if (imageUrl.isNotEmpty()) {
                Glide.with(holder.binding.root.context)
                    .load(imageUrl)
                    .into(ivProductImage)
            } else {
                ivProductImage.setImageResource(R.drawable.img_item_sp1)
            }

            tvProductName.text = product.productId.name
            tvDiscount.text = "${product.productId.sale} %"
            tvSalePrice.text = "${product.productId.price} đ"
            tvOriginalPrice.apply {
                text = "${product.productId.price} đ"
                paintFlags = paintFlags or android.graphics.Paint.STRIKE_THRU_TEXT_FLAG
            }
            tvSold.text = "Đã bán ${product.productId.quantity}"



            ivFavorite.tap {
                // Khi bấm, xóa mục khỏi danh sách
                favoriteList.removeAt(position)  // Xóa mục khỏi danh sách
                notifyItemRemoved(position)      // Thông báo cho adapter về việc loại bỏ
                onFavoriteChanged(product.productId, !isFavorite)
            }


            holder.itemView.setOnClickListener {
                itemClickListener(product.productId)
            }
        }
    }
}
