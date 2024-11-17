const content = document.querySelector(".shadow");
const url = "http://localhost:3000/notification";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getListUser = async () => {
  try {
    const response = await fetch(`${url}/getListNotification`, {
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
      <button class="bg-yellow-500 text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button>
      <input class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm" type="text" />
      <button class="bg-yellow-500 text-white px-4 py-2 rounded ml-2">Tìm kiếm</button>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-yellow-500 text-white">
          <th class="border border-gray-300 px-4 py-2">STT</th>
          <th class="border border-gray-300 px-4 py-2">order_date</th>
          <th class="border border-gray-300 px-4 py-2">total_price</th>
          <th class="border border-gray-300 px-4 py-2">status</th>
          <th class="border border-gray-300 px-4 py-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (item, index) => /*html*/ `
              <tr id="row-${item._id}">
                <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
                <td class="border border-gray-300 px-4 py-2">${
                  item.order_date
                }</td>
                <td class="border border-gray-300 px-4 py-2">${
                  item.total_price
                }</td>
                <td class="border border-gray-300 px-4 py-2">${item.status}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="button-group flex flex-col space-y-2">
                    <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${
                      item._id
                    }">Cập nhật</button>
                    <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${
                      item._id
                    }">Xóa</button>
                    <button class="bg-yellow-500 text-white px-2 py-1 rounded btndetail" data-id="${
                      item._id
                    }">Chi tiết</button>
                  </div>
                </td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
};

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
  if (!confirm("Bạn có chắc muốn xóa không?")) return;
  try {
    await fetch(`${url}/deleterole/${id}`, { method: "DELETE", headers });
    alert("Xóa thành công!");
    getListUser();
  } catch (err) {
    console.log(err);
  }
};

const handleDetail = async (id) => {
  try {
    const response = await fetch(`${url}/getRoleById/${id}`);
    const data = await response.json();
    renderDetailForm(data.result, true, false, "Chi tiết người dùng");
  } catch (err) {
    console.log(err);
  }
};

const handleEdit = async (id) => {
  try {
    const response = await fetch(`${url}/getRoleById/${id}`);
    const data = await response.json();
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
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${
        _id ? `saveEditUser('${_id}')` : "saveAddUser()"
      }">Lưu</button>`
    : "";

  content.innerHTML = /*html*/ `
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="flex">
      <div class="w-1/4"><label class="block text-sm font-medium text-gray-700" for="name">Tên Role</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${name}" ${readonlyAttr} />
      </div>
      <div class="w-3/4"><label class="block text-sm font-medium text-gray-700" for="description">Mô tả</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="description" type="text" value="${description}" ${readonlyAttr} />
      </div>
    </div>
    <div class="mt-4">${saveButtonHTML}<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getListUser()">Quay lại</button></div>`;
};

const saveEditUser = async (_id) => {
  const updatedRole = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
  };
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
    getListUser();
  } catch (error) {
    console.error("Lỗi khi cập nhật role:", error);
    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
};

const saveAddUser = async () => {
  const newRole = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
  };
  try {
    const response = await fetch(`${url}/addRole`, {
      method: "POST",
      headers,
      body: JSON.stringify(newRole),
    });
    const data = await response.json();
    alert(
      data.status ? "Thêm role thành công!" : "Thêm thất bại. Vui lòng thử lại."
    );
    getListUser();
  } catch (error) {
    console.error("Lỗi khi thêm role:", error);
    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
};
async function getUserRoleID(id) {
  // console.log(id, "user");
  try {
    const response = await fetch(
      `http://localhost:3000/user/getuserById/${id}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    return data.result.name;
  } catch (err) {
    console.log(err);
    return "";
  }
}
getListUser();
