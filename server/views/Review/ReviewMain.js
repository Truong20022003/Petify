const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getList = async () => {
  try {
    const response = await fetch(`${url}/product/getListProduct`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    renderTable(data);
  } catch (err) {
    console.log(err);
  }
};

const renderTable = async (data) => {
  content.innerHTML = /*html*/ `
    <table class="content w-full border-collapse">
          ${HtmlTableTitle()}
      <tbody>
        ${data
          .map(
            (item, index) => /*html*/ `
              <tr id="row-${item._id}">
                <td class="w-[20px] border border-gray-300 px-4 py-2">${
                  index + 1
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
                    <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${
                      item._id
                    }">Chi tiết</button>
                  </div>
                </td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
  addEventListeners();
};

const addEventListeners = () => {
  document
    .querySelectorAll(".btndetail")
    .forEach((btn) =>
      btn.addEventListener("click", () => handleDetail(btn.dataset.id))
    );
};

const handleDelete = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa không?")) return;
  try {
    await fetch(`${url}/review/deletereview/${id}`, {
      method: "DELETE",
      headers,
    });
    alert("Xóa thành công!");
    getList();
  } catch (err) {
    console.log(err);
  }
};

const handleDetail = async (id) => {
  try {
    const response = await fetch(`${url}/product/getproductById/${id}`, {
      headers,
    });
    const data = await response.json();
    const ReviewsForProduct = await getReviewsForProduct(id);
    console.log(ReviewsForProduct, "heheheh");
    renderDetailForm(
      data.result,
      true,
      false,
      "Chi tiết người dùng",
      ReviewsForProduct
    );
  } catch (err) {
    console.log(err);
  }
};

const HtmlTableTitle = () => {
  return /*html*/ `<thead>
    <tr class="bg-[#396060] text-white">
      <th class="border border-gray-300 px-4 py-2">STT</th>
      <th class="border border-gray-300 px-4 py-2">Ảnh sản phẩm</th>
      <th class="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
      <th class="border border-gray-300 px-4 py-2">Giá</th>
      <th class="border border-gray-300 px-4 py-2">Hành động</th>
    </tr>
  </thead>`;
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
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${
        _id ? `saveEditUser('${_id}')` : "saveAddUser()"
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
            <span class="text-2xl font-semibold">Tên sản phẩm: ${
              dataproduct.name
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
                    <div id="reviews-container m-5">
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
    const responseReviewProduct = await fetch(
      `http://localhost:3000/reviewProduct/getListReviewProduct`,
      { method: "GET", headers }
    );
    const reviewProductData = await responseReviewProduct.json();
    const reviewIdsForProduct = reviewProductData
      .filter((item) => item.product_id === productId)
      .map((item) => item.review_id);

    const responseReviews = await fetch(
      `http://localhost:3000/review/getListReview`,
      { method: "GET", headers }
    );
    const reviewsData = await responseReviews.json();

    let productReviews = reviewsData.filter((review) =>
      reviewIdsForProduct.includes(review._id)
    );

    // Lọc theo rating nếu có giá trị filterRating
    if (filterRating) {
      productReviews = productReviews.filter(
        (review) => review.rating === Number(filterRating)
      );
    }

    if (productReviews.length === 0) {
      return `
        <div class="flex justify-center items-center  h-[500px]">
          <h2 class="text-2xl font-semibold mb-2 text-gray-800">
            Chưa có đánh giá nào 
          </h2>
        </div>
      `
    }

    const reviewproduct = await Promise.all(
      productReviews.map(async (item) => {
        const datauser = await checkUserByID(item.user_id);
        const formattedDate = formatDate(item.createdAt || item.updatedAt);

        return /*html*/ `
          <div class="border p-4 mb-4 rounded-lg shadow-md hover:shadow-lg">
            <div class="flex items-center mb-2">
              <img class="w-12 h-12 rounded-full mr-2" src="${
                datauser.image
              }" />
              <span class="text-lg font-semibold">${datauser.name}</span>
            </div>
            <div class="mb-2">${renderRatingStars(item.rating)}</div>
            <p>${item.comment}</p>
            <div class="text-gray-500 text-sm mt-2">
              <span>Đánh giá vào: ${formattedDate}</span>
            </div>
          </div>`;
      })
    );
    return reviewproduct.join("");
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

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
