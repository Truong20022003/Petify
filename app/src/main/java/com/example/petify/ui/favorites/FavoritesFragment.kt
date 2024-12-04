package com.example.petify.ui.favorites

import androidx.lifecycle.ViewModelProvider
import com.example.petify.BaseFragment
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.FragmentFavoritesBinding
import com.example.petify.viewmodel.FavoriteViewModel


class FavoritesFragment : BaseFragment<FragmentFavoritesBinding>() {

    private lateinit var adapter: FavoritesAdapter
    private lateinit var favoriteViewModel : FavoriteViewModel

    override fun inflateViewBinding() = FragmentFavoritesBinding.inflate(layoutInflater)


    override fun initView() {
        super.initView()
        favoriteViewModel = ViewModelProvider(this)[FavoriteViewModel::class.java]

    }

}