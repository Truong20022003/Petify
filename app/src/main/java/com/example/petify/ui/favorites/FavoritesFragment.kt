package com.example.petify.ui.favorites

import android.os.Build
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import com.example.petify.BaseFragment
import com.example.petify.data.server.enitities.FavoriteResponse
import com.example.petify.databinding.FragmentFavoritesBinding
import com.example.petify.ultils.SharePreUtils
import com.example.petify.viewmodel.FavoriteViewModel


class FavoritesFragment : BaseFragment<FragmentFavoritesBinding>() {

    private lateinit var adapter: FavoritesAdapter
    private lateinit var favoriteViewModel: FavoriteViewModel
    private var listFavorite1: List<FavoriteResponse> = emptyList()
    override fun inflateViewBinding() = FragmentFavoritesBinding.inflate(layoutInflater)

    override fun onResume() {
        super.onResume()
        val userModel = SharePreUtils.getUserModel(requireActivity())
        adapter.selectedItems.clear()
        favoriteViewModel = ViewModelProvider(requireActivity())[FavoriteViewModel::class.java]
        favoriteViewModel.getListFavorites(userModel!!.id)
        adapter = FavoritesAdapter(
            favoriteList = mutableListOf(),
            itemClickListener = { product ->
                // Xử lý khi click vào item
            },

            onFavoriteChanged = { productModel, isFavorite ->
                if (!isFavorite) {
                    favoriteViewModel.deleteFavorite(productModel.id, userModel!!.id)
                    Log.d(
                        "TAG12345",
                        "ProductThanhCong ${productModel.id} favorite status: $isFavorite"
                    )
                } else {
                    favoriteViewModel.deleteFavorite(productModel.id, userModel!!.id)
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
                adapter.updateItems(favoriteList.toMutableList())
                viewBinding.rcvFavorite.layoutManager = GridLayoutManager(requireContext(), 2)
                viewBinding.rcvFavorite.adapter = adapter
            } else {
                viewBinding.tvEmptyFavorites.visibility = View.VISIBLE
                adapter.updateItems(mutableListOf())
                Log.d("FavoritesFragment", "Favorite list is empty")
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun initView() {
        super.initView()


        val userModel = SharePreUtils.getUserModel(requireActivity())
        favoriteViewModel = ViewModelProvider(requireActivity())[FavoriteViewModel::class.java]
        favoriteViewModel.favoriteList.observe(this) { listFavorite ->
            listFavorite1 =
                listFavorite ?: emptyList() // Gán danh sách trống nếu listFavorite là null
        }
        adapter = FavoritesAdapter(
            favoriteList = mutableListOf(),
            itemClickListener = { product ->
                // Xử lý khi click vào item
            },

            onFavoriteChanged = { productModel, isFavorite ->
                if (!isFavorite) {
                    favoriteViewModel.deleteFavorite(productModel.id, userModel!!.id)
                    listFavorite1 =
                        listFavorite1.filter { it.productId.id != productModel.id } // Loại bỏ sản phẩm khỏi danh sách yêu thích
                    Log.d("TAG12345", "ProductThanhCong ${productModel.id} favorite status: $isFavorite")
                    Toast.makeText(requireActivity(), "Xóa sản phẩm yêu thích thành công", Toast.LENGTH_SHORT).show()
                } else {
                    favoriteViewModel.deleteFavorite(productModel.id, userModel!!.id)
                    listFavorite1 =
                        listFavorite1.filter { it.productId.id != productModel.id } // Loại bỏ sản phẩm khỏi danh sách yêu thích
                    Log.d("TAG12345", "ProductXoa ${productModel.id} favorite status: $isFavorite")
                    Toast.makeText(requireActivity(), "Xóa sản phẩm yêu thích thành công", Toast.LENGTH_SHORT).show()
                }
                Log.d("TAG12345", "Product ${productModel.id} favorite status: $isFavorite")

                adapter.notifyDataSetChanged() // Cập nhật lại adapter
                // Cập nhật danh sách yêu thích trong adapter
                adapter.updateItems(listFavorite1)
                Log.d("TAG12345", "Product ${productModel.id} favorite status: $isFavorite")
                Toast.makeText(requireActivity(), "Lỗi thêm sản phẩm vào yêu thích", Toast.LENGTH_SHORT).show()
                Toast.makeText(requireActivity(), "Lỗi khi xóa sản phẩm yêu thích", Toast.LENGTH_SHORT).show()
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
                adapter.updateItems(favoriteList.toMutableList())
                viewBinding.rcvFavorite.layoutManager = GridLayoutManager(requireContext(), 2)
                viewBinding.rcvFavorite.adapter = adapter
            } else {
                viewBinding.tvEmptyFavorites.visibility = View.VISIBLE
                adapter.updateItems(mutableListOf())
                Log.d("FavoritesFragment", "Favorite list is empty")
            }
        }
    }
}
