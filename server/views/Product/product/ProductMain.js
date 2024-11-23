const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung"
};

const getList = async () => {
  try {
    const response = await fetch(`${url}/product/getListProduct`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    const categories = await Promise.all(
      data.map((item) => getProductsGroupedByCategory(item._id))
    );
    renderTable(data, categories);
    addEventListeners(categories);
  } catch (err) {
    console.log(err);
  }
};

const renderTable = (data, categories) => {

  content.innerHTML = /*html*/ `
    <div class="flex mb-4">
      <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button>
      <input id="searchInput" class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm theo tên sản phẩm" type="text" />
      <div class="ml-4 flex items-center space-x-2">
        <label for="priceRange" class="text-gray-600">Giá sản phẩm:</label>
        <input id="priceRange" type="range" min="0" max="10000" step="100" value="10000" class="w-[200px]">
        <span id="priceValue" class="text-gray-600"></span>
      </div>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-[#396060] text-white">
          <th class="border border-gray-300 px-4 py-2">STT</th>
          <th class="border border-gray-300 px-4 py-2">Ảnh sản phẩm</th>
          <th class="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
          <th class="border border-gray-300 px-4 py-2">Loại sản phẩm</th>
          <th class="border border-gray-300 px-4 py-2">Trạng thái</th>
          <th class="border border-gray-300 px-4 py-2">Giá</th>
          <th class="border border-gray-300 px-4 py-2">Hành động</th>
        </tr>
      </thead>
      <tbody id="dataList"></tbody>
    </table>`;

  document
    .getElementById("searchInput")
    .addEventListener("input", async (e) => {
      const query = e.target.value;
      const filteredUsers = searchUser(query, data);
      document.getElementById("priceRange").addEventListener("input", (e) => {
        const maxPrice = parseInt(e.target.value, 10);
        document.getElementById("priceValue").textContent = `${maxPrice} đ`;
        const filteredProducts = filterProductsByPrice(maxPrice, filteredUsers);
        renderList(filteredProducts, categories);
      });
      renderList(filteredUsers, categories)
    });
  document.getElementById("priceRange").addEventListener("input", (e) => {
    const maxPrice = parseInt(e.target.value, 10);
    document.getElementById("priceValue").textContent = `${maxPrice} đ`;
    const filteredProducts = filterProductsByPrice(maxPrice, data);
    renderList(filteredProducts, categories);
  });

  renderList(data, categories)
};

const renderList = (data, categories) => {
  const tableBody = document.getElementById("dataList");
  tableBody.innerHTML = "";
  // console.log(data, "dataaaa")
  if (data.length === 0) {
    // Nếu không có người dùng nào trong kết quả tìm kiếm
    const noDataRow = /*html*/ `
      <tr>
        <td colspan="8" class="border border-gray-300 px-4 py-2 text-center text-red-500">
          Không có dữ liệu
        </td>
      </tr>`;
    tableBody.innerHTML = noDataRow;
  } else {
    data.forEach(
      (item, index) => {
        const row = /*html*/ `
        <tr id="row-${item._id}">
          <th class="border border-gray-300 px-4 py-2 text-xl w-[20]">${index + 1}</th>
          <td class="border border-gray-300 py-2 w-[180px]"> 
          <div class=" h-[220px]  flex justify-center items-center ">
                  <img
                    alt="Product image"
                    class="w-full h-full object-contain"
                    src="${item.image[0]}"
                  />
                </div>
          <td class="border border-gray-300 px-4 py-2 ">${item.name}</td>
          <td class="border border-gray-300 px-4 py-2 w-[200px]">
          ${Array.isArray(categories[index]) && categories[index].length > 0
            ? categories[index]
              .map((categories, index) => {
                return `<span>${index + 1
                  }_</span><span class="role-item px-2 py-1 rounded mr-2 mt-2 mb-2">${categories.category_name
                  }</span><br>`;
              })
              .join("")
            : "Không thuộc loại sản phẩm nào"
          }
          </td>
          <td class="border border-gray-300 px-4 py-2 ">${item.status}</td>
          <td class="border border-gray-300 px-4 py-2 ">${item.price}</td>
          <td class="border border-gray-300 px-4 py-2 w-[200]">
            <div class="button-group flex flex-col space-y-2">
              <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${item._id
          }">Cập nhật</button>
              <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${item._id
          }">Xóa</button>
              <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${item._id
          }">Chi tiết</button>
            </div>
          </td>
        </tr>`;
        tableBody.innerHTML += row;
      })
  }

}
///
function filterProductsByPrice(maxPrice, data) {
  return data.filter((product) => product.price <= maxPrice);
}
////
// Hàm tìm kiếm người dùng
function searchUser(query, data) {
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  // Lọc danh sách người dùng
  const filteredUsers = data.filter((data) => {
    const dataNameNormalized = removeVietnameseTones(data.name.toLowerCase());
    return dataNameNormalized.includes(queryNormalized);
  });

  return filteredUsers;
}
const addEventListeners = (categories) => {
  document
    .querySelectorAll(".btndelete")
    .forEach((btn) =>
      btn.addEventListener("click", () => handleDelete(btn.dataset.id))
    );
  document
    .querySelectorAll(".btndetail")
    .forEach((btn) =>
      btn.addEventListener("click", () => handleDetail(btn.dataset.id))
    );
  document
    .querySelectorAll(".btnedit")
    .forEach((btn) =>
      btn.addEventListener("click", () => handleEdit(btn.dataset.id))
    );
  document
    .querySelector(".btnadd")
    ?.addEventListener("click", async () => {
      const selectedFiles = [];
      const suppliers = await getListSupplier();
      const categorylist = await getListCategory();
      renderForm({}, false, true, "Thêm sản phẩm", suppliers, categories || [], categorylist)
      handleImageUpload(selectedFiles);
    });
};

const handleDelete = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa không?")) return;
  try {
    await fetch(`${url}/product/deleteproduct/${id}`, { method: "DELETE", headers });
    alert("Xóa thành công!");
    getList();
  } catch (err) {
    console.log(err);
  }
};

const handleDetail = async (id) => {
  try {
    const response = await fetch(`${url}/product/getproductById/${id}`, { headers });
    const data = await response.json();
    // console.log(data, "getRoleById");
    renderDetailHtml(data.result);
  } catch (err) {
    console.log(err);
  }
};

const handleEdit = async (id) => {
  try {
    const response = await fetch(`${url}/product/getproductById/${id}`, { headers });
    const data = await response.json();
    const suppliers = await getListSupplier();
    const category = await getCategoriesByProductId(id);
    const categorylist = await getListCategory();
    // console.log(data, "getRoleById----edit");
    renderForm(data.result, false, true, "Cập nhật sản phẩm", suppliers, category || [], categorylist);
    handleImageUpload(data.result.image);
    // console.log(getAllDisplayedImages(),"link ảnh")
  } catch (err) {
    console.log(err);
  }
};
const renderDetailHtml = (dataproduct) => {
  content.innerHTML = `    
   <h2 class="text-xl font-bold mb-4 items-center">Chi tiết sản phẩm</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 m-5">
  <!-- cuc1 -->
  <div class="space-y-4">
    <div class="flex items-center mb-2 m-5">
    <span class="text-2xl font-semibold">Tên sản phẩm: ${dataproduct.name}</span>
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
<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
  `
}
/////
const renderForm = (
  {
    _id = "",
    image = [],
    supplier_id = "",
    price = "",
    date = "",
    expiry_Date = "",
    quantity = "",
    status = "",
    name = "",
    description = "",
    sale = "",
  },
  isReadonly = false,
  showSaveButton = false,
  title,
  suppliers,
  category,
  categorylist
) => {
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${_id ? `saveEdit('${_id}')` : "saveAdd()"
    }">Lưu</button>`
    : "";
  const readonlyAttr = isReadonly ? "readonly" : "";
  // console.log(category, "category")
  function isCategoryChecked(categoryid) {
    return Array.isArray(category) && category.some(item => item.category_id === categoryid);
  }


  const categoryCheckboxes = categorylist
    .map((item, index) => /*html*/ `
    <label class="category-item">
    <input type="checkbox" name="option" value="${item._id}" ${isCategoryChecked(item._id) ? "checked" : ""}>
    ${item.name}
  </label>
  `)
    .join("");


  content.innerHTML =/*html*/ `
   <style>
      .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          cursor: pointer;
          background-color: red;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
      }
        .grid-container {
        display: grid;                /* Kích hoạt chế độ Grid */
        grid-template-columns: repeat(2, 1fr); /* Chia 2 cột */
        gap: 16px;                    /* Khoảng cách giữa các mục */
        width: 100%;                  /* Đảm bảo toàn bộ chiều rộng khung */
        padding: 8px;                 /* Thêm padding bên trong nếu cần */
      }

      .category-item {
        display: flex;
        align-items: center;          /* Canh giữa checkbox và text */
        gap: 8px;                     /* Khoảng cách giữa checkbox và text */
        font-size: 14px;              /* Kích thước chữ */
      }
    </style>
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <form> 
          <div class="container mx-auto flex justify-between gap-4">
        <!-- Phần chọn ảnh -->
        <div class="w-1/2">
          <input type="file" id="file-input" multiple accept="image/*" class="mb-4" />
          <div id="image-container" class="flex flex-wrap gap-4 overflow-y-scroll h-64 w-full border border-gray-300 p-2">
            ${image
      .map(
        (imgSrc) => /*html*/ `
                <div class="relative w-32 h-32 m-2 inline-block">
                  <img alt="Product Image" class="w-full h-full object-cover rounded-md" src="${imgSrc}" />
                  <button class="remove-btn">X</button>
                </div>
              `
      )
      .join("")}
          </div>
        </div>
        <!-- Phần loại sản phẩm -->
        <div class="w-1/2">
          <h1 class="block text-sm font-medium text-gray-700">
            Loại sản phẩm
          </h1>
          <div id="category-container" class="grid-container">
             ${categoryCheckboxes}
            </div>
        </div>
      </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="product-code">
              Tên sản phẩm
            </label>
            <textarea
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="name"
              rows="9"
              >${name}</textarea>
          </div>
          <div>
          <label class="block text-sm font-medium text-gray-700" for="description">
            Mô tả
          </label>
          <textarea
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="description"
            placeholder="Mô tả của bạn ....."
            rows="9"
          >${description}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="product-price">
              Giá sản phẩm
            </label>
            <input
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="price"
              type="number"
              min="0"
              value="${price}"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"  >
              Nhà phân phối
            </label>
            <select
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="supplier"
            >
              <option>Chọn nhà phân phối</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="start-date">
              Ngày bắt đầu
            </label>
            <input
              class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="start-date"
              type="date"
              value="${convertDateFormat(date)}"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="end-date">
              Ngày kết thúc
            </label>
            <input
              class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="end-date"
              type="date"
              value="${convertDateFormat(expiry_Date)}"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="product-name">
              Trạng thái
            </label>
            <input
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="status"
              placeholder="Tên sản phẩm"
              value="${status}"
              type="text"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"  >
              Số lượng
            </label>
            <input
              class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="quantity"
              type="text"
              value="${quantity}"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"  >
              Giảm giá
            </label>
            <input
              class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="sale"
              type="text"
              value="${sale}"
            />
          </div>
          
        </div>
        <div class="mb-6">
         
        </div>
      <div class="mt-4">
         ${saveButtonHTML}
          <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
        </div>
    </form>
  `

  const supplierSelect = document.getElementById("supplier");

  // Điền các option vào `select`
  suppliers.forEach(supplier => {
    const option = document.createElement("option");
    option.value = supplier._id; // Gán `value` là ID nhà phân phối
    option.textContent = supplier.name; // Hiển thị tên nhà phân phối
    supplierSelect.appendChild(option);
  });

  // Nếu có supplier_id, thiết lập giá trị mặc định
  if (supplier_id) {
    supplierSelect.value = supplier_id;
  }

  supplierSelect.addEventListener("change", (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const id = selectedOption.value;
    const name = selectedOption.textContent;

    console.log("ID Nhà phân phối:", id);
    console.log("Tên Nhà phân phối:", name);
  });

}
///
function convertDateFormat(dateString) {
  // Kiểm tra nếu dateString rỗng hoặc undefined
  if (!dateString) {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Trả về ngày hiện tại với định dạng yyyy-mm-dd
  }

  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`; // yyyy-mm-dd
}

const saveEdit = async (_id) => {
  const namevalues = document.getElementById("name").value
  const descriptionvalues = document.getElementById("description").value
  const updatedRole = {
    name: namevalues,
    description: descriptionvalues,
  };
  console.log(updatedRole, "updatedRole");
  if (namevalues == "") {
    alert("Tên loại người dùng hông được để trống")
    return
  }
  if (descriptionvalues == "") {
    alert("Mô tả loại người dùng hông được để trống")
    return
  }
  try {
    const response = await fetch(`${url}/updaterole/${_id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedRole),
    });
    const data = await response.json();
    alert(
      data.status
        ? "Cập nhật role thành công!"
        : "Cập nhật thất bại. Vui lòng thử lại."
    );
    getList();
  } catch (error) {
    console.error("Lỗi khi cập nhật role:", error);
    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
};

const saveAdd = async () => {
  // const name = document.getElementById("name").value;
  // const description = document.getElementById("description").value;
  // const price = document.getElementById("price").value;
  // const start_date = document.getElementById("start-date").value;
  // const end_date = document.getElementById("end-date").value;
  // const quantity = document.getElementById("quantity").value;
  // const sale = document.getElementById("sale").value;
  // const status = document.getElementById("status").value;


  // const datanew = {
  //   name: name,
  //   description: description,
  //   price: price,
  //   date:start_date,
  //   expiry_Date:end_date,
  //   quantity:quantity,
  //   status:status
  // };
  if (getAllDisplayedImages().length === 0) {
    alert("Hãy thêm ít nhất 1 ảnh");
    return
  }
  const name = "doando";
  const supplier_id = "671da9ea08f0a23211562aa1";
  const price = 2424;
  const date = "10/12/2024";
  const expiry_Date = "21/11/2024";
  const quantity = 34343;
  const status = "con hang";
  const description = "dfsf";
  const sale = 3434;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("supplier_id", supplier_id);
  formData.append("price", price);
  formData.append("date", date);
  formData.append("expiry_Date", expiry_Date);
  formData.append("quantity", quantity);
  formData.append("status", status);
  formData.append("description", description);
  formData.append("sale", sale);

  getAllDisplayedImages().forEach((file) => {
    formData.append("image", file);
    console.log(file)
  });

  // if (!name) {
  //   alert("Tên loại người dùng hông được để trống")
  //   return
  // }
  // if (description == "") {
  //   alert("Mô tả loại người dùng hông được để trống")
  //   return
  // }
  try {
    const response = await fetch(
      `http://localhost:3000/product/addproduct`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );
    const data = await response.json();
    alert(
      data.status
        ? "Thêm role thành công!"
        : "Thêm thất bại. Vui lòng thử lại."
    );
  } catch (error) {
    console.error("Lỗi khi thêm role:", error);
    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
}

const getListSupplier = async () => {
  try {
    const response = await fetch(`${url}/supplier/getListSupplier`, {
      method: "GET",
      headers,
    });
    const data = await response.json(); // Dữ liệu trả về từ API
    return data // Gọi hàm render options
  } catch (err) {
    console.log(err);
    return []
  }
};

const getListCategory = async () => {
  try {
    const response = await fetch(`${url}/category/getListCategory`, {
      method: "GET",
      headers,
    });
    const data = await response.json(); // Dữ liệu trả về từ API
    return data// Gọi hàm render options
  } catch (err) {
    console.log(err);
    return []
  }
};
async function getCategoriesByProductId(id) {
  // console.log(id, "user");
  try {
    const response = await fetch(
      `${url}/productCategory/getCategoriesByProductId/${id}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    // console.log(data.result.categories, "categories");
    return data.result.categories;

  } catch (err) {
    console.log(err);
    return "";
  }
}
const getProductsGroupedByCategory = async (id) => {
  try {
    const response = await fetch(
      `${url}/productCategory/getCategoriesByProduct`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    // console.log(data.result, "doandododo");
    const category = data.result.find((pr) => pr._id === id)
    if (category) {
      // console.log(category.categories, "loai san pham");
      return category.categories;
    } else {
      // console.log("User không tồn tại");
      return [];
    }

  } catch (err) {
    console.log(err);
    return "";
  }
}
getList();
