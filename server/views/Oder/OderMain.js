const content = document.querySelector(".shadow");
const url = "http://localhost:3000/order";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getList = async () => {
  const loadingDialog = dialogLoading("Đang tải...");
  try {
    const response = await fetch(`${url}/getListOrder`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    renderTable(data);
    loadingDialog.close();
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
      <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button>
      <input class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm" type="text" />
      <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2">Tìm kiếm</button>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-[#396060] text-white">
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
                <td class="border border-gray-300 px-4 py-2">${namesuser[index] === ""
            ? "User không tồn tại"
            : namesuser[index]
          }</td>
                <td class="border border-gray-300 px-4 py-2">${item.total_price
          }</td>
                <td class="border border-gray-300 px-4 py-2">${item.status}</td>
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
  const check = true
  if (check) {
    dialogWarning('Hiện tại bạn chưa thể xóa!')
    return
  }
  dialogDelete("Xóa loại đơn hàng", "Bạn có chắc chắn muốn xóa đơn hàng này?", async () => {
    try {
      await fetch(`${url}/deleteorder/${id}`, { method: "DELETE", headers });
      getList();
    } catch (err) {
      dialogError("Xóa thất bại", "")
      console.log(err);
    }
  })
};

const handleDetail = async (id) => {

  try {
    const response = await fetch(`${url}/getorderById/${id}`, { headers });
    const data = await response.json();
    renderDetailForm(data.result, true, false, "Chi tiết người dùng");
  } catch (err) {
    console.log(err);
  }
};

const handleEdit = async (id) => {
  try {
    const response = await fetch(`${url}/getorderById/${id}`, { headers });
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
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${_id ? `saveEdit('${_id}')` : "saveAdd()"
    }">Lưu</button>`
    : "";
  const userName = await checkUserByID(user_id);
      const categoryCheckboxes = categorylist
      .map((item, index) => /*html*/ `
      <label class="category-item">
      <input type="checkbox" name="option" value="${item._id}" ${isCategoryChecked(item._id) ? "checked" : ""}>
      ${item.name}
    </label>
    `)
      .join("");
  content.innerHTML = /*html*/ `
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="">
        <label class="block text-sm font-medium text-gray-700" for="name">Tên người dùng </label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="user_id" type="text" value="${userName}" ${readonlyAttr} />
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
    <div class="mt-4">${saveButtonHTML}<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button></div>`;
};

const saveEdit = async (_id) => {
  const total_price = document.getElementById("total_price").value
  const oder_date = document.getElementById("oder_date").value
  const status = document.getElementById("status").value
  const update= {
    total_price: total_price,
    status: status,
  };
  if (!total_price && Number(total_price)) {
    dialogError("Tổng hóa đơn không được để trống và tổng hóa đơn phải là số!")
    return
  }
  if (!oder_date) {
    dialogError("Ngày tạo hóa đơn không được để trống!")
    return
  }
  const loadingDialog = dialogLoading("Đang tải lên...");
  try {
    const response = await fetch(`${url}/updateorder/${_id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(update),
    });
    const data = await response.json();
    if(data.status){
      dialogSuccess("Cập nhật role thành công!").then(() => {
        getList(); // Chỉ gọi sau khi thông báo xong
      });  
    }else{
      dialogError("Cập nhật role thất bại!")
    }
    loadingDialog.close();
  } catch (error) {
    console.error("Lỗi khi cập nhật role:", error);
    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
};

const saveAdd = async () => {
  const total_price = document.getElementById("total_price").value
  const oder_date = document.getElementById("oder_date").value
  const status = document.getElementById("status").value
  const newdata = {
    total_price: Number(total_price),
    status: status,
    oder_date: oder_date, 
  };
  if (!total_price || isNaN(Number(total_price))) {
    dialogError("Tổng hóa đơn không được để trống và tổng hóa đơn phải là số!");
    return;
  }  
  if (!oder_date) {
    dialogError("Ngày tạo hóa đơn không được để trống!")
    return
  }
  const loadingDialog = dialogLoading("Đang tải lên...");
  try {
    const response = await fetch(`${url}/addorder`, {
      method: "POST",
      headers,
      body: newdata,
    });
    const data = await response.json();
    if(data.status){
      dialogSuccess("Thêm role thành công!").then(() => {
        getList(); // Chỉ gọi sau khi thông báo xong
      });  
    }else{
      dialogError("Thêm role thất bại!")
    }
    loadingDialog.close();
  } catch (error) {
    console.error("Lỗi khi thêm role:", error);
    // alert("Đã xảy ra lỗi. Vui lòng thử lại.");
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

async function checkUser() {
  //   console.log(id, "checkuser");
  try {
    const response = await fetch(
      `http://localhost:3000/user/getListUser`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    return data; 
  } catch (err) {
    console.log(err);
    return ""; 
  }
}
getList();
