const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung"
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
    filteredData = data; // Khởi tạo `filteredData` bằng `originalData` ban đầu

    const categories = await Promise.all(
      data.map((item) => getProductsGroupedByCategory(item._id))
    );
    renderTable(filteredData, categories); // Dùng filteredData

    loadingDialog.close();
  } catch (err) {
    console.log(err);
  }
};

const renderTable = (data, categories) => {
  const maxPrice = Math.max(...data.map(item => item.price));
  content.innerHTML = /*html*/ `
    <div class="flex mb-4">
      <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button>
      <input id="searchInput" class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm theo tên sản phẩm" type="text" />
      <div class="ml-4 flex items-center space-x-2">
        <label for="priceRange" class="text-gray-600">Giá sản phẩm:</label>
        <input id="priceRange" type="range" min="0" max="${maxPrice}" step="100"  class="w-[200px]">
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
    </table>
    <div id="pagination" class="flex justify-between mt-4">
      <button id="prevPage" class="bg-[#008080] text-white px-4 py-2 rounded" disabled>Trang trước</button>
      <span id="currentPage" class="text-gray-600">Trang 1</span>
      <button id="nextPage" class="bg-[#008080] text-white px-4 py-2 rounded">Trang sau</button>
    </div>
  `;

  // Tìm kiếm và lọc giá
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value;
    filteredData = searchUser(query, originalData); // Lọc từ originalData
    currentPage = 1; // Reset trang khi tìm kiếm mới
    updateTable(filteredData, categories); // Cập nhật bảng
  });

  document.getElementById("priceRange").addEventListener("input", (e) => {
    const maxPrice = parseInt(e.target.value, 10);
    document.getElementById("priceValue").textContent = `${maxPrice.toLocaleString('vi-VN')} đ`;
    filteredData = filterProductsByPrice(maxPrice, originalData); // Lọc theo giá trên dữ liệu gốc
    currentPage = 1; // Reset trang khi thay đổi giá
    updateTable(filteredData, categories); // Cập nhật bảng
  });

  // Hiển thị dữ liệu sau khi lọc và phân trang
  updateTable(data, categories);
};

// Cập nhật bảng sau khi lọc, tìm kiếm và phân trang
const updateTable = (filteredProducts, categories) => {
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
        <th class="border border-gray-300 px-4 py-2 text-xl w-[20]">${startIndex + index + 1}</th>
        <td class="border border-gray-300 py-2 w-[180px]">
          <div class="h-[220px] flex justify-center items-center">
            <img alt="Product image" class="w-full h-full object-contain" src="${item.image[0]}" />
          </div>
        </td>
        <td class="border border-gray-300 px-4 py-2">${item.name}</td>
        <td class="border border-gray-300 px-4 py-2 w-[200px]">
          ${Array.isArray(categories[index]) && categories[index].length > 0
          ? categories[index]
            .map((category, idx) => {
              return /*html*/`<span>${idx + 1}_</span><span class="role-item px-2 py-1 rounded mr-2 mt-2 mb-2">${category.category_name}</span><br>`;
            })
            .join(" ")
          : "Không thuộc loại sản phẩm nào"
        }
        </td>
        <td class="border border-gray-300 px-4 py-2">${item.quantity == 0 ? "Hết hàng" : item.status}</td>
        <td class="border border-gray-300 px-4 py-2">${item.price.toLocaleString('vi-VN')}</td>
        <td class="border border-gray-300 px-4 py-2 w-[200]">
          <div class="button-group flex flex-col space-y-2">
            <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${item._id}">Cập nhật</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${item._id}">Xóa</button>
            <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${item._id}">Chi tiết</button>
          </div>
        </td>
      </tr>`;
      tableBody.innerHTML += row;
    });
  }

  updatePagination(filteredProducts.length, filteredProducts, categories);
  addEventListeners(categories);
};

// Cập nhật phân trang
const updatePagination = (totalItems, filteredProducts, categories) => {
  const totalPages = Math.ceil(totalItems / productsPerPage);
  document.getElementById("currentPage").textContent = `Trang ${currentPage} / ${totalPages}`;

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;

  document.getElementById("prevPage").onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable(filteredProducts, categories);
    }
  };

  document.getElementById("nextPage").onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateTable(filteredProducts, categories);
    }
  };
};


// Lọc sản phẩm theo giá
const filterProductsByPrice = (maxPrice, data) => {
  return data.filter(item => item.price <= maxPrice);
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

  dialogDeleteProduct("Xóa sản phẩm", "Bạn có chắc chắn muốn xóa sản phẩm này?", async () => {
    try {
      const loadding = dialogLoading("Đang tiến hành xóa...")
      const response = await fetch(`${url}/product/deleteproduct/${id}`, { method: "DELETE", headers });
      console.log(response)
      const data = await response.json()

      if (response.status == 400) {
        dialogError(data.message)
      } else {
        dialogSuccess("Xóa sản phẩm thành công")
        loadding.close()
        getList();
      }
      // getList();
    } catch (err) {
      dialogError("Xóa thất bại", "")
      console.log(err);
    }
  })

};

const handleDetail = async (id) => {
  try {
    const response = await fetch(`${url}/product/getproductById/${id}`, { headers });
    const data = await response.json();
    // console.log(data, "getRoleById");
    renderDetailHtml(data.result);
    console.log(selectedSupplierId, "id nha phan phoi")
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
}
function convertDateFormat(dateString) {
  // Kiểm tra nếu dateString rỗng hoặc undefined
  if (!dateString) {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Trả về ngày hiện tại với định dạng yyyy-mm-dd
  }

  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`; // yyyy-mm-dd
}
function convertDateFormatUpData(dateString) {
  if (!dateString) {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  }

  // Chuyển đổi ngày từ yyyy-mm-dd sang dd/mm/yyyy
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;  // Trả về định dạng dd/mm/yyyy
}
const saveEdit = async (_id, event, image_id) => {
  event.preventDefault();
  console.log(image_id, "image_id")
  // Lấy dữ liệu từ form
  const getValue = (id) => document.getElementById(id)?.value || "";
  const name = getValue("name");
  const description = getValue("description");
  const price = getValue("price");
  const start_date = getValue("start-date");
  const end_date = getValue("end-date");
  const quantity = getValue("quantity");
  const sale = getValue("sale");
  const status = getValue("status");
  const supplierSelect = document.getElementById("supplier");
  const selectedSupplierId = supplierSelect?.value || "";
  const selectedValues = Array.from(
    document.querySelectorAll('input[name="option"]:checked')
  ).map((cb) => cb.value);
  console.log(selectedValues, "selectedValues")
  const images = getAllDisplayedImages();
  console.log(images, "image")
  // Kiểm tra dữ liệu đầu vào
  const validateInput = () => {
    if (!name) return "Tên sản phẩm là bắt buộc.";
    if (!description) return "Mô tả sản phẩm là bắt buộc.";
    if (!price || isNaN(price)) return "Giá sản phẩm phải là một số hợp lệ.";
    if (!quantity || isNaN(quantity)) return "Số lượng phải là một số hợp lệ.";
    if (!sale || isNaN(sale)) return "Giảm giá phải là một số hợp lệ.";
    if (!status) return "Trạng thái là bắt buộc.";
    if (!start_date || !end_date) return "Ngày bắt đầu và ngày hết hạn là bắt buộc.";
    if (images.length === 0) return "Hãy thêm ít nhất 1 ảnh.";
    if (selectedValues.length === 0) return "Hãy chọn ít nhất một Loại sản phẩm.";
    if (!selectedSupplierId) return "Bạn phải chọn nhà phân phối.";
    return null;
  };

  const errorMessage = validateInput();
  if (errorMessage) {
    dialogError(errorMessage);
    return;
  }
  const currentProduct = await getCategoriesByProductId(_id);
  console.log(currentProduct, "currentProduct")
  const formData = new FormData();
  const imageUrls = images
    .filter((img) => !img.file) // Chỉ lấy URL của ảnh cũ
    .map((img) => img.url);
  formData.append("images", JSON.stringify(imageUrls));

  images.forEach((img) => {
    if (img.file) {
      if (img.file instanceof File) {
        formData.append("image", img.file);
      } else {
        console.log("img.file is not a valid File object:", img.file);
      }
    }
  });



  formData.append("name", name);
  formData.append("price", price);
  formData.append("date", convertDateFormatUpData(start_date));
  formData.append("expiry_Date", convertDateFormatUpData(end_date));
  formData.append("quantity", quantity);
  formData.append("status", status);
  formData.append("description", description);
  formData.append("sale", sale);
  formData.append("supplier_id", selectedSupplierId);

  // In ra dữ liệu để kiểm tra
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  // Xác nhận cập nhật
  dialogInfo(
    "Bạn có muốn cập nhật không?",
    async () => {
      const loadingDialog = dialogLoading("Dữ liệu đang được đẩy lên, vui lòng đợi...");
      try {

        const response = await fetch(
          `http://localhost:3000/product/updateproduct/${_id}`,
          {
            method: "PUT",
            headers,
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.status == 200) {
            Swal.close();
            if (currentProduct.length === 0) {
              for (const categoryId of selectedValues) {
                await addCategoryProduct(_id, categoryId); // Gọi hàm thêm vai trò
              }
            } else {
              for (const categoryId of selectedValues) {
                const isCategoryAlreadyAssigned = currentProduct.some(
                  (category) => category.category_id === categoryId
                );
                console.log(isCategoryAlreadyAssigned, "isCategoryAlreadyAssigned")
                if (!isCategoryAlreadyAssigned) {
                  await addCategoryProduct(_id, categoryId);
                }
              }

              // Xóa loại sản phẩm không còn được chọn
              for (const category of currentProduct) {
                if (!selectedValues.includes(category.category_id)) {
                  await removeCategoryProduct(_id, category.category_id);
                }
              }
            }
          }
          dialogSuccess("Sửa sản phẩm và loại sản phẩm thành công!").then(() => {
            getList(); // Chỉ gọi sau khi thông báo xong
          });;


        } else {
          Swal.close();
          dialogError("Sửa sản phẩm thất bại");
        }

      } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        dialogError("Đã xảy ra lỗi");
      }
    },
    () => {
      getList();
    }
  );
};


const saveAdd = async (event) => {
  event.preventDefault();

  // Lấy giá trị từ form
  const getValue = (id) => document.getElementById(id)?.value || "";
  const name = getValue("name");
  const description = getValue("description");
  const price = getValue("price");
  const start_date = getValue("start-date");
  const end_date = getValue("end-date");
  const quantity = getValue("quantity");
  const sale = getValue("sale");
  const status = getValue("status");
  const supplierSelect = document.getElementById("supplier");
  const selectedSupplierId = supplierSelect?.value || "";
  const selectedValues = Array.from(
    document.querySelectorAll('input[name="option"]:checked')
  ).map((cb) => cb.value);

  const images = getAllDisplayedImages();

  // Kiểm tra dữ liệu
  const validateInput = () => {
    if (!name) return "Tên sản phẩm là bắt buộc.";
    if (!description) return "Mô tả sản phẩm là bắt buộc.";
    if (!price || isNaN(price)) return "Giá sản phẩm phải là một số hợp lệ.";
    if (!quantity || isNaN(quantity)) return "Số lượng phải là một số hợp lệ.";
    if (!sale || isNaN(sale)) return "Giảm giá phải là một số hợp lệ.";
    if (!status) return "Trạng thái là bắt buộc.";
    if (!start_date || !end_date) return "Ngày bắt đầu và ngày hết hạn là bắt buộc.";
    if (images.length === 0) return "Hãy thêm ít nhất 1 ảnh.";
    if (selectedValues.length === 0) return "Hãy chọn ít nhất một Loại sản phẩm.";
    if (!selectedSupplierId) return "Bạn phải chọn nhà phân phối.";
    return null;
  };

  const errorMessage = validateInput();
  if (errorMessage) {
    dialogError(errorMessage);
    return;
  }

  // Chuẩn bị dữ liệu form
  const formData = new FormData();
  images.forEach((file) => formData.append("image", file.file));
  formData.append("name", name);
  formData.append("price", price);
  formData.append("date", convertDateFormatUpData(start_date));
  formData.append("expiry_Date", convertDateFormatUpData(end_date));
  formData.append("quantity", quantity);
  formData.append("status", status);
  formData.append("description", description);
  formData.append("sale", sale);
  formData.append("supplier_id", selectedSupplierId);

  // Hiển thị dữ liệu để kiểm tra
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  // Thực hiện thêm sản phẩm
  const addProduct = async () => {
    const loadingDialog = dialogLoading("Dữ liệu đang được đẩy lên, vui lòng đợi...");
    try {
      const response = await fetch("http://localhost:3000/product/addproduct", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        dialogError("Thêm sản phẩm thất bại");
        return;
      }

      const result = await response.json();
      const productId = result.product.id;

      // Thêm loại sản phẩm
      const productCategoryPromises = selectedValues.map((categoryId) => {
        const productCategoryData = {
          product_id: productId,
          category_id: categoryId,
        };
        return fetch("http://localhost:3000/productCategory/addproduct_category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "trinh_nhung",
          },
          body: JSON.stringify(productCategoryData),
        });
      });

      const productCategoryResponses = await Promise.all(productCategoryPromises);
      const allCategoryAssigned = productCategoryResponses.every((res) => res.ok);

      if (allCategoryAssigned) {
        Swal.close(); // Đóng loading trước
        dialogSuccess("Thêm sản phẩm và loại sản phẩm thành công!").then(() => {
          getList(); // Chỉ gọi sau khi thông báo xong
        });;

      } else {
        Swal.close(); // Đóng loading trước
        dialogError("Thêm loại sản phẩm thất bại!");
      }

    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      Swal.close(); // Đóng loading trước
      dialogError("Đã xảy ra lỗi khi thêm sản phẩm!");
    }
  };

  dialogInfo("Bạn có muốn lưu không?", addProduct, () => getList());
};


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
    return [];
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
    return [];
  }
}

async function removeCategoryProduct(productId, catedoryId) {
  console.log(productId, "productId")
  console.log(catedoryId, "catedoryId")
  try {
    const response = await fetch(
      `http://localhost:3000/productCategory/product_category/${productId}/remove`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "trinh_nhung"
        },
        body: JSON.stringify({ category_id: catedoryId }), // Gửi roleId trong body để xóa vai trò
      }
    );
    const data = await response.json();
    console.log(data, "productCategory");
    return data;
  } catch (err) {
    console.error("Error removing role:", err);
    return null;
  }
}

async function addCategoryProduct(productId, catedoryId) {
  console.log(productId, "productId---aaa")
  console.log(catedoryId, "catedoryId0---aaa")
  try {
    const response = await fetch(
      `http://localhost:3000/productCategory/product_category/${productId}/add`,
      {
        method: "POST",
        headers: {
          Authorization: "trinh_nhung",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category_id: catedoryId }), // Gửi roleId trong body để thêm vai trò
      }
    );
    const data = await response.json();
    console.log(data, "addproductCategory");
    return data;
  } catch (err) {
    console.error("Error adding role:", err);
    return null;
  }
}

getList();
