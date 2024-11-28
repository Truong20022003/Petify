const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getList = async () => {
  try {
    const response = await fetch(`${url}/supplier/getListSupplier`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    renderTable(data);
    addEventListeners();
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
    </table>`;
  document
    .getElementById("searchInput")
    .addEventListener("input", async (e) => {
      const query = e.target.value;
      const filtered = searchUser(query, data);
      renderList(filtered);
    });
  renderList(data);
};
const renderList = (data) => {
  const tableBody = document.getElementById("roleList");
  tableBody.innerHTML = "";
  console.log(data, "dataaaa");

  if (data.length === 0) {
    // Nếu không có người dùng nào trong kết quả tìm kiếm
    const noDataRow = /*html*/ `
      <tr>
        <td colspan="8" class="border border-gray-300 px-4 py-2 text-center text-red-500">
          Không có kết quả trùng khớp
        </td>
      </tr>`;
    tableBody.innerHTML = noDataRow;
  } else {
    data.forEach((item, index) => {
      const dateformat = formatDate(
        item.createdAt == null ? item.updatedAt : item.createdAt
      );
      const row = /*html*/ `
        <tr id="row-${item._id}">
          <td class="border border-gray-300 px-4 py-2 w-[50]">${index + 1}</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${item.name
        }</td>
          <td class="border border-gray-300 px-4 py-2 text-center align-middle">${dateformat}</td>
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
    });
  }
};

////
// Hàm tìm kiếm người dùng
function searchUser(query, data) {
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  // Lọc danh sách người dùng
  const filtered = data.filter((role) => {
    const userNameNormalized = removeVietnameseTones(role.name.toLowerCase());
    return userNameNormalized.includes(queryNormalized);
  });

  return filtered;
}
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
  dialogDelete("Xóa nhà phân phối", "Bạn có chắc chắn muốn xóa nhà phân phối này?", async () => {
    try {
      await fetch(`${url}/supplier/deletesupplier/${id}`, { method: "DELETE", headers });
      getList();
    } catch (err) {
      dialogError("Xóa thất bại", "")
      console.log(err);
    }
  })
};

const handleDetail = async (id) => {
  try {
    const response = await fetch(`${url}/supplier/getsupplierById/${id}`, {
      headers,
    });
    const data = await response.json();
    const checksupplier = await checkProduct(id);
    const filerproduct = checksupplier.filter((item) => item.supplier_id == id);
    console.log(filerproduct, "filerproduct");
    const ProductHtml = productsOnSale(filerproduct);
    console.log(data, "getRoleById");
    renderDetailForm(
      data.result,
      true,
      false,
      "Chi tiết nhà cung cấp",
      ProductHtml
    );
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
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save m-5" onclick="${_id ? `saveEdit('${_id}')` : "saveAdd()"
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

const productsOnSale = (data) => {
  if (data.length === 0) {
    return `
           <div class="flex justify-center items-center  h-[500px]">
            <h2 class="text-2xl font-semibold mb-2 text-gray-800">Hiện tại chưa bán sản phẩm nào</h2>
        </div>
            `;
  }
  const productListFilter = data.map((item) => {
    return /*html*/ `
        <div class="border p-4 mb-4 rounded-lg shadow-md hover:shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 m-5">
          <!-- cuc1 -->
          <div class="space-y-4">
            <div class="flex items-center mb-2 m-5">
            <span class="text-2xl font-semibold">Tên sản phẩm: ${item.name
      }</span>
            </div>
            <div class="flex flex-wrap gap-2 px-2 ">
            ${item.image
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
                <span class="text-gray-600">${item.price}</span>
                </div>
                <div class="mb-2">
                <strong class="text-lg">Ngày nhập:</strong>
                <span class="text-gray-600">${item.date}</span>
                </div>
                <div class="mb-2">
                <strong class="text-lg">Trạng thái:</strong>
                <span class="text-gray-600">${item.status}</span>
                </div>
                <div class="mb-2">
                <strong class="text-lg">Ngày hết hạn:</strong>
                <span class="text-gray-600">${item.expiry_Date}</span>
                </div>
                <div class="mb-2">
                <strong class="text-lg">Số lượng sản phẩm:</strong>
                <span class="text-gray-600">${item.quantity}</span>
                </div>
            </div>
          </div>
        
        <!-- cuc2 -->
        <div class="">
          <strong>Mô tả:</strong>
          <p class="text-gray-700">
            ${item.description.replace(/\n/g, "<br />")}
          </p>
        </div>
        </div>
        <!--  -->
      </div>`;
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
  dialogInfo("Bạn có muốn lưu các thay đổi không?"
    , async () => {
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
            getList();  // Chỉ gọi sau khi thông báo xong
          });  
         
        } else {
          dialogError("Cập nhật thất bại!")
        }
        loadingDialog.close();
      } catch (error) {
        console.error("Lỗi khi cập nhật role:", error);
        dialogError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    },
    () => {
      getList();
    })
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
  dialogInfo("Bạn có muốn lưu không?"
    , async () => {
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
           getList();  // Chỉ gọi sau khi thông báo xong
          });  
          
        } else {
          dialogError("Thêm thất bại!")
        }
        loadingDialog.close();
      } catch (error) {
        console.error("Lỗi khi thêm role:", error);
        dialogError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    },
    () => {
      getList();
    })
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
