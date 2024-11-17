const content = document.querySelector(".shadow");
const url = "http://localhost:3000/order";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getListUser = async () => {
  try {
    const response = await fetch(`${url}/getListOrder`, {
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
  const namesuser = await Promise.all(
    data.map((item) => checkUserByID(item.user_id))
  );
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
          <th class="border border-gray-300 px-4 py-2">tên người dùng</th>
          <th class="border border-gray-300 px-4 py-2">Tổng tiền</th>
          <th class="border border-gray-300 px-4 py-2">Trạng thái</th>
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
                  namesuser[index] === ""
                    ? "User không tồn tại"
                    : namesuser[index]
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
  addEventListeners();
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
    await fetch(`${url}/deleteorder/${id}`, { method: "DELETE", headers });
    alert("Xóa thành công!");
    getListUser();
  } catch (err) {
    console.log(err);
  }
};

const handleDetail = async (id) => {
  try {
    const response = await fetch(`${url}/getorderById/${id}`,{ headers});
    const data = await response.json();
    renderDetailForm(data.result, true, false, "Chi tiết người dùng");
  } catch (err) {
    console.log(err);
  }
};

const handleEdit = async (id) => {
  try {
    const response = await fetch(`${url}/getorderById/${id}`,{ headers});
    const data = await response.json();
    renderDetailForm(data.result, false, true, "Cập nhật người dùng");
  } catch (err) {
    console.log(err);
  }
};

const renderDetailForm = async (
  oder = {},
  isReadonly = false,
  showSaveButton = false,
  title = ""
) => {
  const {
    _id = "",
    user_id = "",
    oder_date = "",
    total_price = "",
    status,
  } = oder;
  const readonlyAttr = isReadonly ? "readonly" : "";
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${
        _id ? `saveEditUser('${_id}')` : "saveAddUser()"
      }">Lưu</button>`
    : "";
    const userName = await checkUserByID(user_id);
  content.innerHTML = /*html*/ `
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="">
        <label class="block text-sm font-medium text-gray-700" for="name">Tên người dùng </label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="userName" type="text" value="${userName}" ${readonlyAttr} />
      </div>
      <div class=""><label class="block text-sm font-medium text-gray-700" for="description">Ngày tạo hóa đơn</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="oder_date" type="text" value="${oder_date}" ${readonlyAttr} />
      </div>
      <div class="">
        <label class="block text-sm font-medium text-gray-700" for="description">Tổng hóa đơn</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="total_price" type="text" value="${total_price}" ${readonlyAttr} />
      </div>
      <div class="">
        <label class="block text-sm font-medium text-gray-700" for="description">Trạng thái</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="status" type="text" value="${status}" ${readonlyAttr} />
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
    const response = await fetch(`${url}/updateorder/${_id}`, {
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
    const response = await fetch(`${url}/addorder`, {
      method: "POST",
      headers,
      body: newRole,
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

    const name = data.result.name;
    console.log(name, "name");

    return name; // Trả về giá trị tên sau khi fetch thành công
  } catch (err) {
    console.log(err);
    return ""; // Trả về chuỗi rỗng nếu có lỗi
  }
}
getListUser();
