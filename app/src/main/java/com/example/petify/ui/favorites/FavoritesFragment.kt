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
import com.example.petify.data.server.enitities.UserModel
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
            favoriteList = mutableListOf(),
            itemClickListener = { product ->
                // Xử lý khi click vào item
            },

            onFavoriteChanged = { productModel, isFavorite ->
                if(isFavorite){
                    val favoriteRequest = FavoriteRequest(productModel.id,userModel!!.id)
                    favoriteViewModel.deleteFavorite(productModel.id,userModel!!.id)
                    Log.d("TAG12345", "ProductThanhCong ${productModel.id} favorite status: $isFavorite")
                }else{
                    favoriteViewModel.deleteFavorite(productModel.id,userModel!!.id)
                    Log.d("TAG12345", "ProductXoa ${productModel.id} favorite status: $isFavorite")
                }
                Log.d(
                    "TAG12345",
                    "Product ${productModel.id} favorite status: $isFavorite"
                )
            }

        )

        favoriteViewModel.getListFavorites(userModel!!.id)
        // Lắng nghe thay đổi từ ViewModel để cập nhật lại danh sách yêu thích
        favoriteViewModel.favoriteList.observe(viewLifecycleOwner) { favoriteList ->
            if (favoriteList != null) {
                // Log danh sách yêu thích
                Log.d("FavoritesFragment", "Fetched Favorites: ${favoriteList.size} items")
                for (item in favoriteList) {
                    Log.d("FavoritesFragment", "Item: ${item.productId} - ${item.id}")
                }
                // Cập nhật dữ liệu cho adapter khi danh sách thay đổi
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
