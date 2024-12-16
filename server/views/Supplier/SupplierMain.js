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
    const response = await fetch(`${url}/supplier/getListSupplier`, {
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
          <th class="border border-gray-300 px-4 py-2">Thời gian gia nhập</th>
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
      const dateformat = formatDate(
        item.createdAt == null ? item.updatedAt : item.createdAt
      );
      const row = /*html*/ `
        <tr id="row-${item._id}">
          <td class="border border-gray-300 px-4 py-2 w-[50]">${index + 1}</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${
            item.name
          }</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${dateformat}</td>
          <td class="border border-gray-300 px-4 py-2 w-[200]">
            <div class="button-group flex flex-col space-y-2">
              <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${
                item._id
              }">Cập nhật</button>
              <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${
                item._id
              }">Xóa</button>
              <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${
                item._id
              }">Chi tiết</button>
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
    ?.addEventListener("click", () =>
      renderDetailForm({}, false, true, "Thêm nhà cung cấp")
    );
};

const handleDelete = async (id) => {
  const checksupplier = await checkProduct(id);
  console.log(checksupplier, "checksupplier");
  const hasSupplier = checksupplier.some((item) => item.supplier_id === id);
  if (hasSupplier) {
    dialogWarning(
      "Bạn không thể xóa nhà cung cấp này vì họ vẫn đang có sản phẩm được bán."
    );
    return;
  }
  dialogDelete(
    "Xóa nhà phân phối",
    "Bạn có chắc chắn muốn xóa nhà phân phối này?",
    async () => {
      try {
        await fetch(`${url}/supplier/deletesupplier/${id}`, {
          method: "DELETE",
          headers,
        });
        getList();
      } catch (err) {
        dialogError("Xóa thất bại", "");
        console.log(err);
      }
    }
  );
};

const handleDetail = async (id) => {
  try {
    const loadding = dialogLoading("Đang tải dữ liệu....");
    const response = await fetch(`${url}/supplier/getsupplierById/${id}`, {
      headers,
    });
    const data = await response.json();
    const checksupplier = await checkProduct(id);
    const filerproduct = checksupplier.filter((item) => item.supplier_id == id);
    console.log(filerproduct, "filerproduct");
    const ProductHtml = productsOnSale(filerproduct);
    console.log(data, "getRoleById");
    renderSupplierDetail(data.result, "Chi tiết nhà cung cấp", ProductHtml);
    loadding.close();
  } catch (err) {
    console.log(err);
  }
};

const handleEdit = async (id) => {
  try {
    const response = await fetch(`${url}/supplier/getsupplierById/${id}`, {
      headers,
    });
    const data = await response.json();
    console.log(data, "getRoleById----edit");
    renderDetailForm(data.result, false, true, "Cập nhật nhà cung cấp");
  } catch (err) {
    console.log(err);
  }
};

const renderDetailForm = (
  supp = {},
  isReadonly = false,
  showSaveButton = false,
  title = "",
  ProductHtml
) => {
  const { _id = "", name = "", description = "", phone_number = "" } = supp;
  const readonlyAttr = isReadonly ? "readonly" : "";
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save m-5" onclick="${
        _id ? `saveEdit('${_id}')` : "saveAdd()"
      }">Lưu</button>`
    : "";
  const htmlproduct = showSaveButton
    ? ""
    : `<h3 class="text-3xl font-semibold m-10">Các sản phẩm hiện đang mở được bán</h3>  ${ProductHtml}`;

  content.innerHTML = /*html*/ `
        <h2 class="text-xl font-bold">${title}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Cột 1: Tên nhà cung cấp và số điện thoại -->
        <div class="flex flex-col space-y-4">
            <div>
            <label class="block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${name}" ${readonlyAttr} />
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="phone_number" type="text" value="${phone_number}" ${readonlyAttr} />
            </div>
        </div>
        <!-- Cột 2: Mô tả -->
        <div class="flex flex-col">
            <label class="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="description" rows="4" ${readonlyAttr}>${description}</textarea>
        </div>
        </div>
            <tbody>
            <div id="reviews-container">
            ${htmlproduct}
            </div>
            </tbody>
    <div class="mt-4">${saveButtonHTML}<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button></div>`;
};
const renderSupplierDetail = (supp = {}, title = "", ProductHtml = "") => {
  const { name = "", description = "", phone_number = "" } = supp;

  content.innerHTML = /*html*/ `
    <h2 class="text-2xl font-bold mb-6 text-gray-800">${title}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <!-- Cột 1: Tên nhà cung cấp và số điện thoại -->
  <div class="flex flex-col space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
      <div class="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-50">
        ${name}
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
      <div class="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-50">
        ${phone_number}
      </div>
    </div>
  </div>
  
  <!-- Cột 2: Mô tả -->
  <div class="flex flex-col space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Mô tả</label>
      <div class="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-50">
        ${description}
      </div>
    </div>
  </div>
</div>

    <h2 class="text-2xl font-bold">Các sản phẩm của nhà cung cấp</h2>
    <div id="reviews-container" class="mt-8">
    <table class="content w-full border-collapse">
    <thead>
    <tr class="bg-[#396060] text-white items-center">
      <th class="border border-gray-300 py-2 w-[10]" >STT</th>
      <th class="border border-gray-300 px-4 py-2 w-[40]">Ảnh sản phẩm</th>
      <th class="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
      <th class="border border-gray-300 px-4 py-2 w-[60]" >Hành động</th>
    </tr>
  </thead>
      ${ProductHtml}
      </table>
      <!-- <div id="pagination" class="flex justify-between mt-4">
      <button id="prevPage" class="bg-[#008080] text-white px-4 py-2 rounded" disabled>Trang trước</button>
      <span id="currentPage" class="text-gray-600">Trang 1</span>
      <button id="nextPage" class="bg-[#008080] text-white px-4 py-2 rounded">Trang sau</button>
    </div> -->
    </div>
    
    <div class="mt-6 flex justify-between items-center">
      <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
    </div>
  `;
};

// Hàm để hiển thị các sản phẩm
const productsOnSale = (data) => {
  if (data.length === 0) {
    return `
      <div class="flex justify-center items-center h-[500px]">
        <h2 class="text-2xl font-semibold mb-2 text-gray-800">Hiện tại chưa bán sản phẩm nào</h2>
      </div>
    `;
  }

  const productListFilter = data.map((item, index) => {
    return /*html*/ `
       <tr id="row-${item._id}">
                <td class="w-[20px] border border-gray-300 px-4 py-2">${
                  index + 1
                }</td>
          <td class="border border-gray-300 px-4 py-2"> 
              <div class=" h-[60px] p-2 flex justify-center items-center ">
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
              <td class="border border-gray-300 px-4 py-2">
              <div class="button-group flex flex-col space-y-2">
      <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${
        item._id
      }">Chi tiết</button>
          </div>
          </td>
          </tr>
     
    `;
  });

  return productListFilter.join("");
};

const saveEdit = async (_id) => {
  const name = document.getElementById("name").value;
  const phone_number = document.getElementById("phone_number").value;
  const description = document.getElementById("description").value;
  if (!name) {
    dialogError("Tên loại người dùng hông được để trống");
    return;
  }
  if (!description) {
    dialogError("Mô tả loại người dùng hông được để trống");
    return;
  }
  if (!phone_number || !/^\d{10,15}$/.test(phone_number)) {
    dialogError("Số điện thoại phải là số từ 10 đến 15 chữ số.");
    return;
  }
  const updatedRole = {
    name: name,
    phone_number: phone_number,
    description: description,
  };
  dialogInfo(
    "Bạn có muốn lưu các thay đổi không?",
    async () => {
      const loadingDialog = dialogLoading("Đang tải lên...");

      try {
        const response = await fetch(`${url}/supplier/updatesupplier/${_id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(updatedRole),
        });
        const data = await response.json();
        if (data.status) {
          dialogSuccess("Cập nhật thành công!").then(() => {
            getList(); // Chỉ gọi sau khi thông báo xong
          });
        } else {
          dialogError("Cập nhật thất bại!");
        }
        loadingDialog.close();
      } catch (error) {
        console.error("Lỗi khi cập nhật role:", error);
        dialogError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    },
    () => {
      getList();
    }
  );
};

const saveAdd = async () => {
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const phone_number = document.getElementById("phone_number").value;

  if (!name) {
    dialogError("Tên loại người dùng hông được để trống");
    return;
  }
  if (!description) {
    dialogError("Mô tả loại người dùng hông được để trống");
    return;
  }
  if (!phone_number || !/^\d{10,15}$/.test(phone_number)) {
    dialogError("Số điện thoại phải là số từ 10 đến 15 chữ số.");
    return;
  }
  const newdata = {
    name: name,
    description: description,
    phone_number: phone_number,
  };
  dialogInfo(
    "Bạn có muốn lưu không?",
    async () => {
      const loadingDialog = dialogLoading("Đang tải lên...");

      try {
        const response = await fetch(`${url}/supplier/addsupplier`, {
          method: "POST",
          headers,
          body: JSON.stringify(newdata),
        });
        const data = await response.json();
        if (data.status === "Add successfully") {
          dialogSuccess("Thêm thành công!").then(() => {
            getList(); // Chỉ gọi sau khi thông báo xong
          });
        } else {
          dialogError("Thêm thất bại!");
        }
        loadingDialog.close();
      } catch (error) {
        console.error("Lỗi khi thêm role:", error);
        dialogError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    },
    () => {
      getList();
    }
  );
};
async function checkProduct(supplier_id) {
  console.log(supplier_id, "some");
  try {
    const response = await fetch(
      `http://localhost:3000/product/getListProduct`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    console.log(data, "supplierId");

    return data;
  } catch (err) {
    console.log(err);
    return false; // Trả về false nếu có lỗi
  }
}
////
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
getList();
