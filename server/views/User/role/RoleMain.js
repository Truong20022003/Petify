const content = document.querySelector(".shadow");
const url = "http://localhost:3000/role";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getListUser = async () => {
  try {
    const loadingDialog = dialogLoading("Đang tải danh sách dữ liệu...");
    const response = await fetch(`${url}/getListRole`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    renderTable(data);
    addEventListeners();
    loadingDialog.close();
  } catch (err) {
    console.log(err);
  }
};

const renderTable = (data) => {
  content.innerHTML = /*html*/ `
    <div class="flex mb-4">
      <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button>
      <input    id="searchInput" class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm" type="text" />
      <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2">Tìm kiếm</button>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-[#396060] text-white">
          <th class="border border-gray-300 px-4 py-2">STT</th>
          <th class="border border-gray-300 px-4 py-2">ID Role</th>
          <th class="border border-gray-300 px-4 py-2">Name</th>
          <th class="border border-gray-300 px-4 py-2">Description</th>
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
      const filteredUsers = searchUser(query, data);
      renderList(filteredUsers)
    });
  renderList(data)
};
const renderList = (data) => {
  const tableBody = document.getElementById("roleList");
  tableBody.innerHTML = "";
  console.log(data, "dataaaa")
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
          <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
          <td class="border border-gray-300 px-4 py-2">${item._id}</td>
          <td class="border border-gray-300 px-4 py-2">${item.name}</td>
          <td class="border border-gray-300 px-4 py-2">${item.description}</td>
          <td class="border border-gray-300 px-4 py-2">
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

////
// Hàm tìm kiếm người dùng
function searchUser(query, data) {
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  // Lọc danh sách người dùng
  const filteredUsers = data.filter((role) => {
    const userNameNormalized = removeVietnameseTones(role.name.toLowerCase());
    return userNameNormalized.includes(queryNormalized);
  });

  return filteredUsers;
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
      renderDetailForm({}, false, true, "Thêm người dùng")
    );
};

const handleDelete = async (id) => {
  dialogDelete("Xóa loại người dùng", "Bạn có chắc chắn muốn xóa loại người dùng này?", async () => {
    try {
      await fetch(`${url}/deleterole/${id}`, { method: "DELETE", headers });
      getListUser();
    } catch (err) {
      dialogError("Xóa thất bại", "")
      console.log(err);
    }
  })

};

const handleDetail = async (id) => {
  try {
    const response = await fetch(`${url}/getRoleById/${id}`, { headers });
    const data = await response.json();
    console.log(data, "getRoleById");
    renderDetailForm(data.result, true, false, "Chi tiết người dùng");
  } catch (err) {
    console.log(err);
  }
};

const handleEdit = async (id) => {
  try {
    const response = await fetch(`${url}/getRoleById/${id}`, { headers });
    const data = await response.json();
    console.log(data, "getRoleById----edit");
    renderDetailForm(data.result, false, true, "Cập nhật người dùng");
  } catch (err) {
    console.log(err);
  }
};

const renderDetailForm = (
  user = {},
  isReadonly = false,
  showSaveButton = false,
  title = ""
) => {
  const { _id = "", name = "", description = "" } = user;
  const readonlyAttr = isReadonly ? "readonly" : "";
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save m-5" onclick="${_id ? `saveEditUserRole('${_id}')` : "saveAddUserRole()"
    }">Lưu</button>`
    : "";

  content.innerHTML = /*html*/ `
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="flex">
      <div class="w-1/4 m-5"><label class="block text-sm font-medium text-gray-700" for="name">Tên Role</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${name}" ${readonlyAttr} />
      </div>
      <div class="w-3/4 m-5"><label class="block text-sm font-medium text-gray-700" for="description">Mô tả</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="description" type="text" value="${description}" ${readonlyAttr} />
      </div>
    </div>
    <div class="mt-4">${saveButtonHTML}<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getListUser()">Quay lại</button></div>`;
};

const saveEditUserRole = async (_id) => {
  const namevalues = document.getElementById("name").value
  const descriptionvalues = document.getElementById("description").value
  const updatedRole = {
    name: namevalues,
    description: descriptionvalues,
  };
  console.log(updatedRole, "updatedRole");
  if (!namevalues) {
    dialogError("Tên loại người dùng không được để trống!")
    return
  }
  if (!descriptionvalues) {
    dialogError("Mô tả loại người dùng không được để trống!")
    return
  }
  dialogInfo("Bạn có muốn lưu các thay đổi không?"
    , async () => {
      const loadingDialog = dialogLoading("Đang tải danh sách sản phẩm...");

      try {
        const response = await fetch(`${url}/updaterole/${_id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(updatedRole),
        });
        const data = await response.json();
        if (data.status) {
          dialogSuccess("Cập nhật thành công!").then(() => {
          getListUser();   // Chỉ gọi sau khi thông báo xong
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
      getListUser();
    })

};

const saveAddUserRole = async () => {
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const newRole = {
    name: name,
    description: description,
  };
  console.log(newRole, "newRole");
  console.log("Name:", name, "Description:", description);
  if (name == "") {
    dialogError("Tên loại người dùng không được để trống!")
    return
  }
  if (description == "") {
    dialogError("Mô tả loại người dùng hông được để trống")
    return
  }
  dialogInfo("Bạn có muốn lưu không?"
    , async () => {
      try {
        const response = await fetch(`${url}/addrole`, {
          method: "POST",
          headers,
          body: JSON.stringify(newRole),
        });
        const data = await response.json();
        if (data.status) {
          dialogSuccess("Thêm thành công!")
          getListUser();
        } else {
          dialogError("Thêm thất bại!")
        }
      } catch (error) {
        console.error("Lỗi khi thêm role:", error);
        dialogError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    },
    () => {
      getListUser();
    })

};

getListUser();
