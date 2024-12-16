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
    const response = await fetch(`${url}/carrier/getListCarier`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    console.log(data);
    allData = data; // Lưu dữ liệu tổng hợp
    filteredData = data; // Mặc định ban đầu là toàn bộ dữ liệu
    totalPages = Math.ceil(allData.length / 10); // Giả sử mỗi trang có 10 bản ghi
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
          <th class="border border-gray-300 px-4 py-2">Tên nhà cung cấp</th>
          <th class="border border-gray-300 px-4 py-2">Số điện thoại</th>
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
      totalPages = Math.ceil(filteredData.length / 10); // Tính lại số trang sau tìm kiếm
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
  const start = (currentPage - 1) * 10;
  const end = start + 10;
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
      const row = /*html*/ `
        <tr id="row-${item._id}">
          <td class="border border-gray-300 px-4 py-2 w-[50]">${index + 1}</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${
            item.name
          }</td>
                <td class="border border-gray-300 px-4 py-2 text-center align-middle">${
                  item.phone
                }</td>
          <td class="border border-gray-300 px-4 py-2 w-[200]">
            <div class="button-group flex flex-col space-y-2">
              <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${
                item._id
              }">Cập nhật</button>
              <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${
                item._id
              }">Xóa</button>
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
    const response = await fetch(`${url}/carrier/getCarrierById/${id}`, {
      headers,
    });
    const data = await response.json();
    console.log(data, "getRoleById----edit");
    dialogcomfirm(data.result, "Cập nhật nhà đơn vị vận chuyển");
  } catch (err) {
    console.log(err);
  }
};

// const renderDetailForm = (
//     supp = {},
//     isReadonly = false,
//     showSaveButton = false,
//     title = "",

// ) => {
//     const { _id = "", name = "", phone = "" } = supp;
//     const readonlyAttr = isReadonly ? "readonly" : "";
//     const saveButtonHTML = showSaveButton
//         ? `<button class="bg-green-500 text-white px-4 py-2 rounded save m-5" onclick="${_id ? `saveEdit('${_id}')` : "saveAdd()"
//         }">Lưu</button>`
//         : "";
//     content.innerHTML = /*html*/ `
//         <h2 class="text-xl font-bold">${title}</h2>
//         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <!-- Cột 1: Tên nhà cung cấp và số điện thoại -->
//         <div class="flex flex-wrap space-x-4">
//   <!-- Tên nhà cung cấp -->
//         <div class="flex-1">
//             <label class="block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
//             <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${name}" ${readonlyAttr} />
//         </div>

//         <!-- Số điện thoại -->
//         <div class="flex-1">
//             <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
//             <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="phone_number" type="text" value="${phone}" ${readonlyAttr} />
//         </div>
//         </div>
//         </div>

//     <div class="mt-4">${saveButtonHTML}<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button></div>`;
// };
const dialogcomfirm = (supp = {}, isReadonly = false, title = "") => {
  const { _id = "", name = "", phone = "" } = supp;
  const readonlyAttr = isReadonly ? "readonly" : "";

  Swal.fire({
    title: title || "Thông tin nhà cung cấp", // Nếu không có title thì dùng mặc định
    html: /*html*/ `
        <div class="flex flex-wrap space-x-4">
          <!-- Tên nhà cung cấp -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${name}"   />
          </div>
        
          <!-- Số điện thoại -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="phone_number" type="text" value="${phone}" />
          </div>
        </div>
        <!-- Vùng thông báo lỗi -->
        <div id="error-message" class="text-red-500 text-sm mt-2"></div>
        `,
    showCancelButton: true,
    confirmButtonText: "Lưu",
    cancelButtonText: "Hủy",
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      // Lấy giá trị của các input sau khi xác nhận
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone_number").value;

      // Kiểm tra lỗi trước khi gửi dữ liệu
      const errorMessage = document.getElementById("error-message");
      if (!name) {
        errorMessage.textContent = "Tên nhà cung cấp không được để trống.";
        return false; // Ngăn không cho dialog đóng
      }
      if (!phone || !/^\d{10,15}$/.test(phone)) {
        errorMessage.textContent =
          "Số điện thoại phải là số từ 10 đến 15 chữ số.";
        return false; // Ngăn không cho dialog đóng
      }

      // Thực hiện các xử lý hoặc gửi dữ liệu
      if (_id) {
        saveEdit(_id, name, phone);
      } else {
        saveAdd(name, phone);
      }
    },
  });
};

// Hàm giả để xử lý khi lưu thêm hoặc sửa
const saveAdd = async (name, phone) => {
  const errorMessage = document.getElementById("error-message"); // Vùng lỗi trong dialog

  // Xác thực trước khi gửi
  if (!name) {
    errorMessage.textContent = "Tên nhà cung cấp không được để trống.";
    return;
  }
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    errorMessage.textContent = "Số điện thoại phải là số từ 10 đến 15 chữ số.";
    return;
  }

  const newdata = { name, phone };
  const loadingDialog = dialogLoading("Đang tải lên...");

  try {
    const response = await fetch(`${url}/carrier/addCarrier`, {
      method: "POST",
      headers,
      body: JSON.stringify(newdata),
    });
    const data = await response.json();

    if (data.status === "Add successfully") {
      dialogSuccess("Thêm thành công!").then(() => {
        getList(); // Tải lại danh sách sau khi thêm thành công
      });
    } else {
      errorMessage.textContent = "Thêm thất bại! Vui lòng thử lại.";
    }
  } catch (error) {
    console.error("Lỗi khi thêm nhà cung cấp:", error);
    errorMessage.textContent = "Đã xảy ra lỗi. Vui lòng thử lại.";
  } finally {
    loadingDialog.close();
  }
};

const saveEdit = async (_id, name, phone) => {
  const errorMessage = document.getElementById("error-message"); // Vùng lỗi trong dialog

  // Xác thực trước khi gửi
  if (!name) {
    errorMessage.textContent = "Tên nhà cung cấp không được để trống.";
    return;
  }
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    errorMessage.textContent = "Số điện thoại phải là số từ 10 đến 15 chữ số.";
    return;
  }

  const updatedData = { name, phone };
  const loadingDialog = dialogLoading("Đang tải lên...");

  try {
    const response = await fetch(`${url}/carrier/updateCarrier/${_id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();

    if (data.status) {
      dialogSuccess("Cập nhật thành công!").then(() => {
        getList(); // Tải lại danh sách sau khi cập nhật thành công
      });
    } else {
      errorMessage.textContent = "Cập nhật thất bại! Vui lòng thử lại.";
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật nhà cung cấp:", error);
    errorMessage.textContent = "Đã xảy ra lỗi. Vui lòng thử lại.";
  } finally {
    loadingDialog.close();
  }
};

getList();
