const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};
let currentPage = 1;
const productsPerPage = 10;
let filteredData = []; // Dữ liệu đã lọc
let originalData = []; // Dữ liệu ban đầu (chưa lọc)
const getList = async () => {
  try {
    const loadingDialog = dialogLoading("Đang tải danh sách sản phẩm...");
    const response = await fetch(`${url}/product/getListProduct`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    // Lưu dữ liệu gốc vào `originalData`
    originalData = data;
    filteredData = data;
    renderTable(filteredData);
    loadingDialog.close();
  } catch (err) {
    console.log(err);
  }
};

const renderTable = async (data) => {
  content.innerHTML = /*html*/ `
    <table class="content w-full border-collapse">
    <div class="flex mb-4">
      <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Tìm kiếm</button>
      <input id="searchInput" class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm theo tên sản phẩm" type="text" />
    </div>
    <thead>
    <tr class="bg-[#396060] text-white">
      <th class="border border-gray-300 px-4 py-2">STT</th>
      <th class="border border-gray-300 px-4 py-2">Ảnh sản phẩm</th>
      <th class="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
      <th class="border border-gray-300 px-4 py-2">Giá</th>
      <th class="border border-gray-300 px-4 py-2">Hành động</th>
    </tr>
  </thead>
  <tbody id="dataList"></tbody>
    </table>
    <div id="pagination" class="flex justify-between mt-4">
      <button id="prevPage" class="bg-[#008080] text-white px-4 py-2 rounded" disabled>Trang trước</button>
      <span id="currentPage" class="text-gray-600">Trang 1</span>
      <button id="nextPage" class="bg-[#008080] text-white px-4 py-2 rounded">Trang sau</button>
    </div>`;
  // Tìm kiếm và lọc giá

  document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value;
    filteredData = searchUser(query, originalData); // Lọc từ originalData
    currentPage = 1; // Reset trang khi tìm kiếm mới
    updateTable(filteredData); // Cập nhật bảng
  });
  updateTable(data);
};
const updateTable = (filteredProducts) => {
  const tableBody = document.getElementById("dataList");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedData = filteredProducts.slice(startIndex, endIndex);

  if (paginatedData.length === 0) {
    const noDataRow = /*html*/ `
      <tr>
        <td colspan="7" class="border border-gray-300 px-4 py-2 text-center text-red-500">
          Không có dữ liệu
        </td>
      </tr>`;
    tableBody.innerHTML = noDataRow;
  } else {
    paginatedData.forEach((item, index) => {
      const row = /*html*/ `
            <tr id="row-${item._id}">
              <td class="w-[20px] border border-gray-300 px-4 py-2">${startIndex + index + 1
        }</td>
              <td class="border border-gray-300 px-4 py-2"> 
              <div class=" h-[220px] p-2 flex justify-center items-center ">
                <img
                  alt="Product image"
                  class="w-full h-full object-contain"
                  src="${item.image[0]}"
                />
              </div>
              </td>
              <td class="border border-gray-300 px-4 py-2 w-[400px] break-words">
                ${item.name}
              </td>
              <td class="border border-gray-300 px-4 py-2">${item.status}</td>
              <td class="border border-gray-300 px-4 py-2">
                <div class="button-group flex flex-col space-y-2">
                  <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${item._id
        }">Chi tiết</button>
                </div>
              </td>
            </tr>`;
      tableBody.innerHTML += row;
    });
  }
  updatePagination(filteredProducts.length, filteredProducts);
  addEventListeners();
};
const addEventListeners = () => {
  document
    .querySelectorAll(".btndetail")
    .forEach((btn) =>
      btn.addEventListener("click", () => handleDetail(btn.dataset.id))
    );
};

const updatePagination = (totalItems, filteredProducts) => {
  const totalPages = Math.ceil(totalItems / productsPerPage);
  document.getElementById(
    "currentPage"
  ).textContent = `Trang ${currentPage} / ${totalPages}`;

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;

  document.getElementById("prevPage").onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable(filteredProducts);
    }
  };

  document.getElementById("nextPage").onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateTable(filteredProducts);
    }
  };
};
function searchUser(query, data) {
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  query = removeVietnameseTones(query).toLowerCase();
  return data.filter((item) => {
    const itemName = removeVietnameseTones(item.name).toLowerCase();
    return itemName.includes(query);
  });
}
const handleDetail = async (id) => {
  console.log(id, "id");
  const loadingDialog = dialogLoading("Đang tải lên...");
  try {
    const response = await fetch(`${url}/product/getproductById/${id}`, {
      headers,
    });
    const data = await response.json();

    const ReviewsForProduct = await getReviewsForProduct(id);
    // console.log(ReviewsForProduct, "heheheh");
    renderDetailForm(
      data.result,
      true,
      false,
      "Chi tiết người dùng",
      ReviewsForProduct
    );
    loadingDialog.close();
  } catch (err) {
    console.log(err);
  }
};

const renderDetailForm = async (
  dataproduct = {},
  isReadonly = false,
  showSaveButton = false,
  title = "",
  ReviewsForProduct
) => {
  const readonlyAttr = isReadonly ? "readonly" : "";
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${_id ? `saveEditUser('${_id}')` : "saveAddUser()"
    }">Lưu</button>`
    : "";

  content.innerHTML = /*html*/ `
        <div class="flex mb-4">
            <div class="flex mb-4">
          <select id="rating-filter" class="border rounded px-4 py-2">
            <option value="">Tất cả</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
          <button id="filter-btn" class="bg-blue-500 text-white px-4 py-2 rounded ml-2">Lọc</button>
        </div>
          </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 m-5">
          <!-- cuc1 -->
          <div class="space-y-4">
            <div class="flex items-center mb-2 m-5">
            <span class="text-2xl font-semibold">Tên sản phẩm: ${dataproduct.name
    }</span>
            </div>
            <div class="flex flex-wrap gap-2 px-2 ">
            ${dataproduct.image
      .map(
        (img) => /*html*/ `
                <div
                    class="w-[100px] h-[100px] flex-shrink-0 border border-gray-300 rounded-lg overflow-hidden hover:shadow-md hover:border-gray-400 transition"
                >
                    <img
                    alt="Product image"
                    class="w-full h-full object-cover"
                    src="${img}"
                    />
                </div>
                `
      )
      .join("")}
            </div>
            <div class="space-y-4 m-5">
                <div class="mb-2">
                <strong class="text-lg">Giá sản phẩm:</strong>
                <span class="text-gray-600">${dataproduct.price}</span>
                </div>
                <div class="mb-2">
                <strong class="text-lg">Ngày nhập:</strong>
                <span class="text-gray-600">${dataproduct.date}</span>
                </div>
                <div class="mb-2">
                <strong class="text-lg">Trạng thái:</strong>
                <span class="text-gray-600">${dataproduct.status}</span>
                </div>
                <div class="mb-2">
                <strong class="text-lg">Ngày hết hạn:</strong>
                <span class="text-gray-600">${dataproduct.expiry_Date}</span>
                </div>
                <div class="mb-2">
                <strong class="text-lg">Số lượng sản phẩm:</strong>
                <span class="text-gray-600">${dataproduct.quantity}</span>
                </div>
            </div>
          </div>
        
        <!-- cuc2 -->
        <div class="">
          <strong class="text-lg">Mô tả:</strong>
          <p class="text-gray-700">
            ${dataproduct.description.replace(/\n/g, "<br />")}
          </p>
        </div>
        </div>
          </div>
              <h3 class="text-xl font-semibold mb-10">Chi tiết đánh giá</h3>
                    <tbody>
                    <div id="reviews-container">
                        ${ReviewsForProduct}
                        </div>
                    </tbody>
              <div class=" m-5">${saveButtonHTML}<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button></div>`;

  document.getElementById("filter-btn").addEventListener("click", async () => {
    const rating = document.getElementById("rating-filter").value;
    const reviews = await getReviewsForProduct(dataproduct._id, rating);
    document.querySelector("#reviews-container").innerHTML = reviews;
  });
};
/////
const getReviewsForProduct = async (productId, filterRating = "") => {
  try {
    // Fetch reviews from the API
    console.log(productId, "productId ididi");
    const responseReviewProduct = await fetch(
      `http://localhost:3000/review/getReviewsByProduct/${productId}`,
      { method: "GET", headers }
    );
    const reviewProductData = await responseReviewProduct.json();

    console.log(reviewProductData, "reviewProductData");

    // Check if `data` exists and is an array
    if (reviewProductData && Array.isArray(reviewProductData.data)) {
      let productReviews = reviewProductData.data;

      // If filterRating is provided, filter the reviews
      if (filterRating) {
        productReviews = productReviews.filter(
          (review) => review.rating === Number(filterRating)
        );
      }

      // If no reviews match the filter or if there are no reviews
      if (productReviews.length === 0) {
        return `
          <div class="flex justify-center items-center h-[500px]">
            <h2 class="text-2xl font-semibold mb-2 text-gray-800">
              Chưa có đánh giá nào
            </h2>
          </div>
        `;
      }

      // Format reviews into HTML
      const reviewproduct = await Promise.all(
        productReviews.map(async (item) => {
          const formattedDate = formatDate(item.createdAt || item.updatedAt);
          return /*html*/ `
            <div class="border p-4 mb-4 rounded-lg shadow-md hover:shadow-lg relative">
              <!-- Dấu ba chấm -->
              <div class="absolute top-2 right-2">
                <button class="text-gray-500 hover:text-gray-700" onclick="toggleMenu(event)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6h.01M12 12h.01M12 18h.01" />
                  </svg>
                </button>
                <!-- Menu thả xuống -->
                <div class="hidden absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10" id="menu">
                  <!-- <button class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onclick="handleEdit()">Sửa</button> -->
                  <button class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100" onclick="handleDelete('${item._id
            }')">Xóa</button>
                </div>
              </div>

              <!-- Nội dung chính -->
              <div class="flex items-center mb-2">
                <img class="w-12 h-12 rounded-full mr-2" src="${item.user_id.avata || "default-avatar.jpg"
            }" />
                <span class="text-lg font-semibold">${item.user_id.name}</span>
              </div>
              <div class="mb-2">${renderRatingStars(item.rating)}</div>
              <p>${item.comment}</p>
              <div class="text-gray-500 text-sm mt-2">
                <span>Đánh giá vào: ${formattedDate}</span>
              </div>
            </div>
          `;
        })
      );

      return reviewproduct.join("");
    } else {
      return `
        <div class="flex justify-center items-center h-[500px]">
          <h2 class="text-2xl font-semibold mb-2 text-gray-800">
            Chưa có đánh giá nào
          </h2>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return `
      <div class="flex justify-center items-center h-[500px]">
        <h2 class="text-2xl font-semibold mb-2 text-gray-800">
          Không thể tải đánh giá
        </h2>
      </div>
    `;
  }
};

const handleDelete = async (id) => {
  console.log(id, "eeeeee");
  dialogDelete(
    "Xóa đánh giá",
    "Bạn có chắc chắn muốn xóa đánh giá này?",
    async () => {
      try {
        await fetch(`${url}/review/deletereview/${id}`, {
          method: "DELETE",
          headers,
        });
      } catch (err) {
        dialogError("Xóa thất bại", "");
        console.log(err);
      }
    }
  );
};
function toggleMenu(event) {
  event.stopPropagation();
  const menu = event.target.closest(".relative").querySelector("#menu");
  const isHidden = menu.classList.contains("hidden");
  document.querySelectorAll(".relative #menu").forEach((menu) => {
    menu.classList.add("hidden");
  });
  if (isHidden) {
    menu.classList.remove("hidden");
  } else {
    menu.classList.add("hidden");
  }
}

// Sự kiện để đóng menu nếu click ngoài
document.addEventListener("click", (e) => {
  if (!e.target.closest(".relative")) {
    // Ẩn tất cả các menu khi click bên ngoài
    document.querySelectorAll(".relative #menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  }
});

////
function renderRatingStars(rating) {
  const fullStars = Math.floor(rating); // Tính số sao đầy đủ
  const hasHalfStar = rating % 1 !== 0; // Kiểm tra xem có sao nửa không
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Tính số sao rỗng

  let starsHTML = "";

  // Thêm sao đầy đủ
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<i class="fas fa-star text-yellow-500"></i>`;
  }

  // Thêm sao nửa nếu có
  if (hasHalfStar) {
    starsHTML += `<i class="fas fa-star-half-alt text-yellow-500"></i>`;
  }

  // Thêm sao rỗng
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<i class="fas fa-star text-gray-300"></i>`;
  }

  return starsHTML;
}

// Hàm render hình ảnh sản phẩm (có thể thay đổi tùy thuộc vào số lượng hình ảnh)
function renderProductImages(images) {
  return images
    .map(
      (image) => `
    <div>
      <img alt="Product image" class="w-full h-full object-cover" height="100" src="${image}" width="100"/>
    </div>
  `
    )
    .join("");
}

// Hàm định dạng thời gian
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  if (days > 0) {
    return `${days} ngày trước (${formattedDate})`;
  }
  if (hours > 0) {
    return `${hours} giờ trước (${formattedDate})`;
  }
  if (minutes > 0) {
    return `${minutes} phút trước (${formattedDate})`;
  }
  return `${seconds} giây trước (${formattedDate})`;
}

async function checkUserByID(id) {
  //   console.log(id, "checkuser");
  try {
    const response = await fetch(
      `http://localhost:3000/user/getuserById/${id}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    // console.log(data.result, "datauser");

    const listdata = {
      name: data.result.name,
      image: data.result.avata,
      email: data.result.email,
      phone: data.result.phone_number,
    };
    // console.log(name, "name");

    return listdata;
  } catch (err) {
    console.log(err);
    return ""; // Trả về chuỗi rỗng nếu có lỗi
  }
}

getList();
