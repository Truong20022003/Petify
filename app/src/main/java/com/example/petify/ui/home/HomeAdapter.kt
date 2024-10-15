import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.petify.databinding.ItemRcvHomeBinding
import com.example.petify.model.ProductItem
import com.example.petify.model.ProductModel
import com.example.petify.ui.home.ItemAdapter

class HomeAdapter(
    private val productModels: List<ProductModel>,
    private val onItemClick: (ProductItem) -> Unit
) : RecyclerView.Adapter<HomeAdapter.ProductViewHolder>() {

    class ProductViewHolder(val binding: ItemRcvHomeBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemRcvHomeBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProductViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val productModel = productModels[position]
        holder.binding.apply {
            tvDes.text = productModel.product

            val itemAdapter = ItemAdapter(productModel.items ?: emptyList()) { selectedItem ->
                onItemClick(selectedItem)
            }
            rvItem.adapter = itemAdapter

            tvViewMore.setOnClickListener {
            }
        }
    }

    override fun getItemCount(): Int = productModels.size
}
