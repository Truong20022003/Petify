const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

let currentPage = 1;
let totalPages = 1;
let allData = []; // Dữ liệu tổng hợp sau khi lấy từ API.
let filteredData = []; // Dữ liệu đã lọc từ tìm kiếm

const getList = async (page = 1, query = "") => {
  try {
    const loadding = dialogLoading("Đang tải dữ liệu...");
    const response = await fetch(`${url}/product/getListProduct`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    console.log(data);
    allData = data; // Lưu dữ liệu tổng hợp
    filteredData = data; // Mặc định ban đầu là toàn bộ dữ liệu
    totalPages = Math.ceil(allData.length / 15); // Giả sử mỗi trang có 10 bản ghi
    renderTable(data);
    loadding.close();
  } catch (err) {
    console.log(err);
  }
};

const renderTable = (data) => {
  content.innerHTML = /*html*/ `
    <div class="flex mb-4">
      <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button>
      <input  id="searchInput" class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm" type="text" />
      <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2">Tìm kiếm</button>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-[#396060] text-white">
          <th class="border border-gray-300 px-4 py-2">STT</th>
          <th class="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
          <th class="border border-gray-300 px-4 py-2">Giá gốc</th>
          <th class="border border-gray-300 px-4 py-2">Giảm giá</th>
          <th class="border border-gray-300 px-4 py-2">Giá sau giảm </th>
          <th class="border border-gray-300 px-4 py-2">Hành động</th>
        </tr>
      </thead>
      <tbody id="roleList">
      </tbody>
    </table>
    <div class="pagination flex justify-between mt-4">
        <button id="prevPage" class="bg-[#008080] text-white px-4 py-2 rounded" disabled>Trang trước</button>
        <span id="pageInfo" class="text-gray-700">Trang ${currentPage} / ${totalPages}</span>
        <button id="nextPage" class="bg-[#008080] text-white px-4 py-2 rounded">Trang sau</button>
    </div>`;
  document
    .getElementById("searchInput")
    .addEventListener("input", async (e) => {
      const query = e.target.value;
      filteredData = search(query, allData);
      currentPage = 1; // Reset về trang đầu khi tìm kiếm
      totalPages = Math.ceil(filteredData.length / 15); // Tính lại số trang sau tìm kiếm
      renderList(filteredData); // Render lại dữ liệu sau tìm kiếm
    });
  // Xử lý chuyển trang
  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderList(filteredData); // Render lại dữ liệu sau khi chuyển trang
    }
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderList(filteredData); // Render lại dữ liệu khi quay lại trang trước
    }
  });
  renderList(data);
};
const renderList = (data) => {
  const tableBody = document.getElementById("roleList");
  tableBody.innerHTML = "";
  console.log(data, "dataaaa");
  const start = (currentPage - 1) * 15;
  const end = start + 15;
  const paginatedData = data.slice(start, end);
  if (paginatedData.length === 0) {
    // Nếu không có người dùng nào trong kết quả tìm kiếm
    const noDataRow = /*html*/ `
      <tr>
        <td colspan="8" class="border border-gray-300 px-4 py-2 text-center text-red-500">
          Không có kết quả trùng khớp
        </td>
      </tr>`;
    tableBody.innerHTML = noDataRow;
  } else {
    paginatedData.forEach((item, index) => {
      const discountedPrice = item.price - (item.price * item.sale) / 100;
      const row = /*html*/ `
        <tr id="row-${item._id}">
          <td class="border border-gray-300 px-4 py-2 w-[50]">${
            start + index + 1
          }</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${
            item.name
          }</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${item.price.toLocaleString(
            "vi-VN"
          )}đ</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${
            item.sale
          }%</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${discountedPrice.toLocaleString(
            "vi-VN"
          )}đ</td>
          <td class="border border-gray-300 px-4 py-2 w-[200]">
            <div class="button-group flex flex-col space-y-2">
              <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${
                item._id
              }">Cập nhật</button>
              <!-- <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${
                item._id
              }">Chi tiết</button> -->
            </div>
          </td>
        </tr>`;
      tableBody.innerHTML += row;
    });
  }
  updatePaginationButtons();
  addEventListeners();
};

const updatePaginationButtons = () => {
  document.getElementById(
    "pageInfo"
  ).textContent = `Trang ${currentPage} / ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
};

function search(query, data) {
  const removeVietnameseTones = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  return data.filter((role) => {
    const userNameNormalized = removeVietnameseTones(role.name.toLowerCase());
    return userNameNormalized.includes(queryNormalized);
  });
}
////

const addEventListeners = () => {
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
    ?.addEventListener("click", () => dialogcomfirm({}, "Thêm nhà cung cấp"));
};

const handleDelete = async (id) => {
  dialogDeleteProduct(
    "Xóa nhà phân phối",
    "Bạn có chắc chắn muốn xóa nhà phân phối này?",
    async () => {
      try {
        // Gửi yêu cầu DELETE đến backend
        const loadding = dialogLoading("Đang tiến hành xóa...");
        const response = await fetch(`${url}/carrier/deleteCarrier/${id}`, {
          method: "DELETE",
          headers,
        });

        const data = await response.json();
        if (response.status === 400) {
          dialogError(data.message);
        } else if (response.ok) {
          // Nếu xóa thành công
          dialogSuccess("Xóa thành công", "Nhà phân phối đã được xóa.");
          loadding.close();
          getList();
        }
      } catch (err) {
        // Nếu có lỗi trong quá trình gửi yêu cầu
        dialogError("Xóa thất bại", "Có lỗi xảy ra khi thực hiện yêu cầu.");
        console.error(err);
      }
    }
  );
};

// const handleDetail = async (id) => {
//     try {
//         const response = await fetch(`${url}/carrier/getCarrierById/${id}`, {
//             headers,
//         });
//         const data = await response.json();
//         const checksupplier = await checkProduct(id);
//         const filerproduct = checksupplier.filter((item) => item.supplier_id == id);
//         console.log(filerproduct, "filerproduct");
//         const ProductHtml = productsOnSale(filerproduct);
//         console.log(data, "getRoleById");
//         renderSupplierDetail(
//             data.result,
//             "Chi tiết nhà cung cấp",
//             ProductHtml
//         );
//     } catch (err) {
//         console.log(err);
//     }
// };

const handleEdit = async (id) => {
  try {
    const loadding = dialogLoading("Dữ liệu đang được tải...");
    const response = await fetch(`${url}/product/getproductById/${id}`, {
      headers,
    });
    const data = await response.json();
    console.log(data, "getRoleById----edit");
    loadding.close();
    dialogUpdateSale(data.result, `Cập nhật giảm giá cho sản phẩm`);
  } catch (err) {
    console.log(err);
  }
};

const dialogUpdateSale = (
  product = {},
  title = "Cập nhật giảm giá sản phẩm"
) => {
  const { _id = "", name = "", price = "", sale = "" } = product;

  Swal.fire({
    title: title,
    html: /*html*/ `
        <div class="p-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-lg border border-gray-200">
          <!-- Tên sản phẩm -->
          <div class="mb-6">
            <label class="block text-lg font-bold text-gray-800 mb-3">Tên sản phẩm</label>
            <div class="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg px-5 py-4 shadow-sm">
              ${name}
            </div>
          </div>

          <!-- Giá gốc -->
          <div class="mb-6">
            <label class="block text-lg font-bold text-gray-800 mb-3">Giá gốc (₫)</label>
            <div class="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg px-5 py-4 shadow-sm">
              ${formatCurrency(price)}
            </div>
          </div>

          <!-- Giảm giá -->
          <div class="mb-6">
            <label class="block text-lg font-bold text-gray-800 mb-3">Giảm giá (%)</label>
            <input 
              type="number"
              id="productSale"
              class="w-full border border-indigo-400 rounded-xl shadow-sm px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
              value="${sale}"
              placeholder="Nhập giảm giá (từ 0 đến 100)"
            />
            <div id="error-sale" class="text-red-500 text-sm mt-2"></div>
          </div>

          <!-- Giá sau giảm -->
          <div>
            <label class="block text-lg font-bold text-gray-800 mb-3">Giá sau giảm (₫)</label>
            <div class="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg px-5 py-4 shadow-sm" id="finalPrice"></div>
          </div>
        </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Lưu",
    cancelButtonText: "Hủy",
    focusConfirm: false,
    allowOutsideClick: false,
    customClass: {
      confirmButton:
        "bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 shadow-md",
      cancelButton:
        "bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400 shadow-md",
    },
    didOpen: () => {
      // Tính toán giá sau giảm
      const saleInput = document.getElementById("productSale");
      const finalPriceElement = document.getElementById("finalPrice");

      const updateFinalPrice = () => {
        const sale = parseFloat(saleInput.value) || 0;
        const discountedPrice = price - (price * sale) / 100;
        finalPriceElement.textContent = formatCurrency(discountedPrice);
      };

      saleInput.addEventListener("input", updateFinalPrice);
      updateFinalPrice(); // Khởi tạo giá trị ban đầu
    },
    preConfirm: () => {
      const sale = document.getElementById("productSale").value.trim();
      const errorSale = document.getElementById("error-sale");

      // Xác thực
      let isValid = true;
      errorSale.textContent = "";

      if (!sale || isNaN(sale) || sale < 0 || sale > 100) {
        errorSale.textContent =
          "Giảm giá phải nằm trong khoảng từ 0% đến 100%.";
        isValid = false;
      }

      if (!isValid) return false;

      return { sale: parseFloat(sale) };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { sale } = result.value;
      saveDiscount(_id, sale);
    }
  });
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const saveDiscount = async (_id, sale) => {
  try {
    console.log(sale, "sale");
    const loadding = dialogLoading("Dữ liệu đang được đẩy...");
    const response = await fetch(`${url}/product/updateSalePrice/${_id}/sale`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ sale: sale }),
    });
    const data = await response.json();
    console.log(data, "datasale");
    if (data.success === true) {
      Swal.fire(
        "Thành công",
        "Cập nhật giá và giảm giá thành công!",
        "success"
      ).then(() => {
        getList(); // Làm mới danh sách sản phẩm
      });
    } else {
      Swal.fire("Lỗi", "Cập nhật không thành công. Vui lòng thử lại.", "error");
    }
    loadding.close();
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    Swal.fire("Lỗi", "Đã xảy ra lỗi trong quá trình cập nhật.", "error");
  }
};

getList();
