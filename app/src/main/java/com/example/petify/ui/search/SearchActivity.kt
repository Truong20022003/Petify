package com.example.petify.ui.search

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import android.view.MotionEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import android.widget.Toast
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.petify.BaseActivity
import com.example.petify.BaseViewModel
import com.example.petify.R
import com.example.petify.data.server.enitities.ProductModel
import com.example.petify.databinding.ActivitySearchBinding
import com.example.petify.ui.home.ProductAdapter
import com.example.petify.viewmodel.ProductViewModel
import java.text.Normalizer
import java.util.regex.Pattern


class SearchActivity : BaseActivity<ActivitySearchBinding, BaseViewModel>() {

    private lateinit var productViewModel: ProductViewModel
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var adapterProduct: ProductAdapter
    private var productList: List<ProductModel> = emptyList()
    override fun createBinding(): ActivitySearchBinding {
        return ActivitySearchBinding.inflate(layoutInflater)
    }

    override fun setViewModel(): BaseViewModel {
        return BaseViewModel()
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun initView() {
        super.initView()
        productViewModel = ViewModelProvider(this)[ProductViewModel::class.java]
        sharedPreferences = getSharedPreferences("SearchHistory", Context.MODE_PRIVATE)

        adapterProduct = ProductAdapter(
            productList = emptyList(),
            itemClickListener = { product ->
                Log.d("CLICK", "Clicked on product: ${product.name}")
            },
            onFavoriteChanged = { product, isFavorite ->
                Log.d("FAVORITE", "Product: ${product.name}, isFavorite: $isFavorite")
            },
            onAddToCart = { product, isAdded ->
                Log.d("CART", "Added to cart: ${product.name}, isAdded: $isAdded")
            }
        )

        binding.rcvProduct.adapter = adapterProduct
        binding.rcvProduct.layoutManager = GridLayoutManager(this, 2)
        loadSearchHistory()

        val suggestionAdapter = SuggestionAdapter(suggestions = emptyList()) { suggestion ->
            binding.edtSearch.setText(suggestion)
            val filteredProducts = productList?.filter { product ->
                product.name.normalizeSearch().contains(suggestion.normalizeSearch()) ||
                        product.description?.normalizeSearch()
                            ?.contains(suggestion.normalizeSearch()) == true
            } ?: emptyList()

            adapterProduct.updateData(filteredProducts)
            binding.rcvProduct.visibility =
                if (filteredProducts.isNotEmpty()) View.VISIBLE else View.GONE
            binding.rcvSuggestions.visibility = View.GONE
            saveSearchHistory(suggestion)
        }
        binding.rcvSuggestions.adapter = suggestionAdapter
        binding.rcvSuggestions.layoutManager = LinearLayoutManager(this)
        productViewModel.getListProduct()
        productViewModel.productList.observe(this) { productList ->
            productList?.let {
                this.productList = it
            }
            binding.edtSearch.addTextChangedListener { text ->
                val hasText = !text.isNullOrEmpty()
                binding.edtSearch.setCompoundDrawablesWithIntrinsicBounds(
                    R.drawable.ic_search, 0, if (hasText) R.drawable.ic_edit_clear else 0, 0
                )
                val query = text?.toString()?.trim()?.normalizeSearch() ?: ""
                binding.rcvProduct.visibility = View.GONE
                if (query.isNotEmpty()) {
                    binding.rcvProduct.visibility = View.GONE
                    val filteredNames = productList?.filter { product ->
                        val normalizedProductName = product.name.normalizeSearch()
                        val queryWords = query.split(" ")
                        queryWords.all { queryWord ->
                            normalizedProductName.contains(queryWord)
                        }
                    } ?: emptyList()

                    val filteredDescriptions = productList?.filter { product ->
                        val normalizedProductDescription =
                            product.description?.normalizeSearch() ?: ""
                        val queryWords = query.split(" ")
                        queryWords.all { queryWord ->
                            normalizedProductDescription.contains(queryWord)
                        }
                    } ?: emptyList()
                    val combinedFilteredProducts = (filteredNames + filteredDescriptions).distinct()
                    suggestionAdapter.updateData(combinedFilteredProducts.map { it.name })
                    if (combinedFilteredProducts.isNotEmpty()) {
                        binding.rcvSuggestions.visibility = View.VISIBLE
                        binding.layoutEmpty.visibility = View.GONE
                    } else {
                        binding.rcvSuggestions.visibility = View.GONE
                        binding.layoutEmpty.visibility = View.VISIBLE
                    }
                    binding.rcvSearchHistory.visibility = View.GONE
                } else {
                    binding.rcvSuggestions.visibility = View.GONE
                    binding.rcvSearchHistory.visibility = View.VISIBLE
                    binding.layoutEmpty.visibility = View.GONE
                }
            }


            binding.edtSearch.setOnEditorActionListener { v, actionId, _ ->
                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                    val query = v.text.toString().trim().normalizeSearch()
                    val filteredNames = productList?.filter { product ->
                        val normalizedProductName = product.name.normalizeSearch()
                        query.split(" ").all { queryWord ->
                            normalizedProductName.contains(queryWord)
                        }
                    }
                    filteredNames?.let { adapterProduct.updateData(it) }
                    binding.layoutEmpty.visibility =
                        if (!filteredNames?.isNotEmpty()!!) View.VISIBLE else View.GONE

                    binding.rcvProduct.visibility =
                        if (filteredNames?.isNotEmpty()!!) View.VISIBLE else View.GONE
                    binding.rcvSuggestions.visibility = View.GONE
                    binding.rcvSearchHistory.visibility = View.GONE
                    saveSearchHistory(query)
                    val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
                    imm.hideSoftInputFromWindow(v.windowToken, 0)
                    true
                } else {
                    false
                }
            }

        }

        binding.edtSearch.setOnTouchListener { v, event ->
            val drawableRight = binding.edtSearch.compoundDrawables[2]
            if (drawableRight != null) {
                val clearButtonStartX =
                    binding.edtSearch.width - drawableRight.bounds.width() - binding.edtSearch.paddingRight
                val clearButtonEndX = binding.edtSearch.width - binding.edtSearch.paddingRight

                if (event.action == MotionEvent.ACTION_UP) {
                    if (event.x >= clearButtonStartX && event.x <= clearButtonEndX) {
                        binding.edtSearch.setText("")
                        Log.d("TAONE", "Text cleared")
                        return@setOnTouchListener true
                    }
                }
            }
            false
        }

        binding.ivBack.setOnClickListener {
            finish()
        }
    }

    fun String.normalizeSearch(): String {
        return Normalizer.normalize(this, Normalizer.Form.NFD)
            .replace("\\p{InCombiningDiacriticalMarks}+".toRegex(), "")
            .lowercase()
    }

    fun loadSearchHistory() {
        val sharedPreferences = getSharedPreferences("SearchHistory", Context.MODE_PRIVATE)
        val history =
            sharedPreferences.getStringSet("history", mutableSetOf())?.toList() ?: emptyList()
        Log.d("SearchHistory", "Loaded history: $history")
        val historyAdapter = SearchHistoryAdapter(history, onDeleteClick = { query ->
            removeSearchHistory(query)
        }, onItemClick = { query ->
            binding.edtSearch.setText(query)
            performSearch(query)
        })
        binding.rcvSearchHistory.layoutManager = LinearLayoutManager(this)
        binding.rcvSearchHistory.adapter = historyAdapter
        binding.rcvSearchHistory.visibility = if (history.isNotEmpty()) View.VISIBLE else View.GONE
    }

    fun performSearch(query: String) {
        val filteredProducts = productList.filter { product ->
            product.name.contains(query, ignoreCase = true) || product.description?.contains(
                query,
                ignoreCase = true
            ) == true
        }
        adapterProduct.updateData(filteredProducts)
        binding.rcvProduct.visibility =
            if (filteredProducts.isNotEmpty()) View.VISIBLE else View.GONE
        binding.rcvSuggestions.visibility = View.GONE
        saveSearchHistory(query)
    }

    fun saveSearchHistory(query: String) {
        val sharedPreferences = getSharedPreferences("SearchHistory", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        val history = sharedPreferences.getStringSet("history", mutableSetOf())?.toMutableList()
            ?: mutableListOf()

        if (!history.contains(query)) {
            history.add(0, query)
            if (history.size > 10) {
                history.removeAt(history.size - 1)
            }
        }


        editor.putStringSet("history", history.toSet())
        editor.apply()
    }

    fun removeSearchHistory(query: String) {
        val sharedPreferences = getSharedPreferences("SearchHistory", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        val history = sharedPreferences.getStringSet("history", mutableSetOf())?.toMutableList() ?: mutableListOf()
        history.remove(query)
        editor.putStringSet("history", history.toSet())
        editor.apply()
        loadSearchHistory()
    }
}
