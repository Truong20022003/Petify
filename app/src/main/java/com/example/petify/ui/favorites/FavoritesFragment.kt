package com.example.petify.ui.favorites

import android.os.Build
import android.util.Log
import android.view.View
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseFragment
import com.example.petify.R
import com.example.petify.data.database.AppDatabase
import com.example.petify.data.server.enitities.FavoriteRequest
import com.example.petify.data.server.enitities.FavoriteResponse
import com.example.petify.databinding.FragmentFavoritesBinding
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.FavoriteViewModel


class FavoritesFragment : BaseFragment<FragmentFavoritesBinding>() {

    private lateinit var adapter: FavoritesAdapter
    private lateinit var favoriteViewModel : FavoriteViewModel

    override fun inflateViewBinding() = FragmentFavoritesBinding.inflate(layoutInflater)

    override fun onResume() {
        super.onResume()
        val userModel = SharePreUtils.getUserModel(requireActivity())
        adapter.selectedItems.clear()
        favoriteViewModel.getListFavorites(userModel!!.id)
        favoriteViewModel.favoriteList.observe(viewLifecycleOwner) { favoriteList ->
            if (favoriteList != null) {
                adapter.updateItems(favoriteList)
                viewBinding.rcvFavorite.layoutManager = GridLayoutManager(requireContext(),2)
                viewBinding.rcvFavorite.adapter = adapter
            } else {
                viewBinding.tvEmptyFavorites.visibility = View.VISIBLE
                adapter.updateItems(emptyList())
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun initView() {
        super.initView()

        val userModel = SharePreUtils.getUserModel(requireActivity())
        favoriteViewModel = ViewModelProvider(requireActivity())[FavoriteViewModel::class.java]
        adapter = FavoritesAdapter(
            emptyList(),
            itemClickListener = { product ->
                // Xử lý khi click vào item
            },
            onFavoriteChanged = { product, isFavorite ->
                if (isFavorite) {
                    favoriteViewModel.deleteFavorite(product.id,userModel!!.id)
                    Log.d("TAG12345", "ProductXoathanhcong ${product.id} favorite status: $isFavorite")
//                    // Xử lý thêm vào danh sách yêu thích
//                    favoriteViewModel.addFavorites(FavoriteRequest(
//                        userId = userModel!!.id,
//                        productId = product.id
//                    ))
                } else {
                    // Xử lý xóa khỏi danh sách yêu thích
//                    favoriteViewModel.deleteFavorite(product.id,userModel!!.id)
//                    Log.d("TAG12345", "ProductXoaThanhCong ${product.id} favorite status: $isFavorite")
//                    favoriteViewModel.deleteFavorite(idProduct = product.id,
//                        idUser = userModel!!.id)
                    Log.d("TAG12345", "Không thể thêm sản phẩm vào yêu thích từ FavoritesFragment")
                }
                favoriteViewModel.getListFavorites(userModel!!.id)
            }
        )

        favoriteViewModel.getListFavorites(userModel!!.id)
        favoriteViewModel.favoriteList.observe(viewLifecycleOwner) { favoriteList ->
            if (favoriteList != null) {
                // Log danh sách yêu thích
                Log.d("FavoritesFragment", "Fetched Favorites: ${favoriteList.size} items")
                for (item in favoriteList) {
                    Log.d("FavoritesFragment", "Item: ${item.productId} - ${item.id}")
                }
                adapter.updateItems(favoriteList)
                viewBinding.rcvFavorite.layoutManager = GridLayoutManager(requireContext(), 2)
                viewBinding.rcvFavorite.adapter = adapter
            } else {
                viewBinding.tvEmptyFavorites.visibility = View.VISIBLE
                adapter.updateItems(emptyList())
                Log.d("FavoritesFragment", "Favorite list is empty")
            }
        }
    }
}
