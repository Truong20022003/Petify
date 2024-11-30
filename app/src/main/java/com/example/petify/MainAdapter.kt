package com.example.petify

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.example.petify.ui.cart.CartFragment
import com.example.petify.ui.favorites.FavoritesFragment
import com.example.petify.ui.home.HomeFragment

class MainAdapter(fragmentActivity: FragmentActivity) : FragmentStateAdapter(fragmentActivity) {

    override fun createFragment(position: Int): Fragment {
        return when (position) {
            0 -> HomeFragment()
            1 -> CartFragment()
            2 -> FavoritesFragment()
            3 -> FavoritesFragment()
            else -> throw IllegalArgumentException("Invalid position")
        }
    }

    override fun getItemCount(): Int {
        return 4
    }
}