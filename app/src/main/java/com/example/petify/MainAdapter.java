package com.example.petify;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.example.petify.ui.cart.CartFragment;
import com.example.petify.ui.favorites.FavoritesFragment;
import com.example.petify.ui.home.HomeFragment;
import com.example.petify.ui.love.LoveFragment;


// Adapter for the main ViewPager2
public class MainAdapter extends FragmentStateAdapter {

    // Constructor
    public MainAdapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
    }

    // Create the fragment based on position
    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new HomeFragment();
            case 1:
                return new CartFragment();
            case 2:
                return new LoveFragment();
            case 3:
                return new FavoritesFragment();
            default:
                return null; // Return null for invalid position
        }
    }

    // Return the total number of fragments
    @Override
    public int getItemCount() {
        return 4;
    }
}
