const content = document.querySelector(".shadow");
console.log(content);
let url = "http://localhost:3000/user";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};
let tbody = document.querySelector("tbody");
let table = document.querySelector("table");
const getListUser = async () => {
  try {
    const response = await fetch(`${url}/getListUser`, {
      method: "GET",
      headers,
    });
    const data = await response.json();

    // Lấy danh sách `roles` cho từng người dùng bằng cách đợi tất cả các hàm async hoàn thành
    const roles = await Promise.all(
      data.map((item) => getAllUsersWithRoles(item._id))
    );

    // Hiển thị bảng với dữ liệu người dùng và vai trò
    content.innerHTML =
      /*html*/ `<div class="flex mb-4">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded mr-2 btnadd">
              Thêm mới
            </button>
            <input
              class="border border-gray-300 rounded px-4 py-2 flex-grow"
              placeholder="Tìm kiếm"
              type="text"
            />
            <button class="bg-yellow-500 text-white px-4 py-2 rounded ml-2">
              Tìm kiếm
            </button>
          </div>
          <table class="content w-full border-collapse">
            <thead>
              <tr class="bg-yellow-500 text-white">
                <th class="border border-gray-300 px-4 py-2">STT</th>
                <th class="border border-gray-300 px-4 py-2">Tên người dùng</th>
                <th class="border border-gray-300 px-4 py-2" style="width: 300px;">Loại người dùng</th>
                <th class="border border-gray-300 px-4 py-2">Email</th>
                <th class="border border-gray-300 px-4 py-2">Địa chỉ</th>
                <th class="border border-gray-300 px-4 py-2">Số điện thoại</th>
                <th class="border border-gray-300 px-4 py-2">Ảnh</th>
                <th class="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>` +
      data
        .map(
          (item, index) => /*html*/ `<tr id="row-${item._id}">
                <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
                <td class="border border-gray-300 px-4 py-2">${item.name}</td>
                <td class="border border-gray-300 px-4 py-2">
                ${
                  Array.isArray(roles[index]) && roles[index].length > 0
                    ? roles[index]
                        .map((role, index) => {
                          return `<span>${
                            index + 1
                          }_</span><span class="role-item px-2 py-1 rounded mr-2 mt-2 mb-2">${
                            role.name
                          }</span><br>`;
                        })
                        .join("")
                    : "Không có vai trò"
                }
                </td>
                <td class="border border-gray-300 px-4 py-2">${item.email}</td>
                <td class="border border-gray-300 px-4 py-2">${
                  item.location || ""
                }</td>
                <td class="border border-gray-300 px-4 py-2">${
                  item.phone_number || ""
                }</td>
                <td class="border border-gray-300 px-4 py-2">
                  <img alt="Product image" class="w-12 h-12" height="50" src="${
                    item.avata
                  }" width="50" />
                </td>
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
                    }">
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>`
        )
        .join("");

    // Xử lý các sự kiện sau khi hiển thị bảng
    setupEventListeners(roles);
  } catch (error) {
    console.log("Error fetching user data:", error);
  }
};
function setupEventListeners(roles) {
  ///
  document.querySelectorAll(".btndelete").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("delete");
      id = btn.dataset.id;
      console.log(id);
      if (confirm("ban co chac muon xoa khong")) {
        fetch(`${url}/deleteuser/${id}`, {
          method: "DELETE",
          headers,
        })
          .then((rep) => rep.json())
          .then(() => {
            restoreRow();
            alert("xoa thanh cong");
          })
          .catch((err) => console.log(err));
      }
    });
  });
  /////chi tiet
  document.querySelectorAll(".btndetail").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("detail");
      id = btn.dataset.id;
      console.log(id);
      fetch(`${url}/getuserById/${id}`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .then(async (data) => {
          // console.log(data, "kkkk");
          const roles = await getAllUsersWithRoles(data.result._id);
          content.innerHTML = createUserDetailHTML(
            data.result,
            true,
            false,
            "Chi tiết người dùng",
            roles || []
          );
          const passwordInput = document.getElementById("password");
          const eyeIcon = document.querySelector(".fas.fa-eye");
          eyeIcon.addEventListener("click", () => {
            togglePassword(passwordInput, eyeIcon);
          });
          document.querySelector(".back")?.addEventListener("click", () => {
            restoreRow();
          });
        })
        .catch((err) => console.log(err));
    });
  });
  ///cap nhat
  document.querySelectorAll(".btnedit").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("edit");
      id = btn.dataset.id;
      fetch(`${url}/getuserById/${id}`, {
        headers,
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log(data, "kkkk");
          const roles = await getAllUsersWithRoles(data.result._id);
          const rolesList = await getRoles();
          console.log(roles, "roles");
          content.innerHTML = createUserDetailHTML(
            data.result,
            false,
            true,
            "Cập nhật người dùng",
            roles || [],
            rolesList || []
          );
          const passwordInput = document.getElementById("password");
          const eyeIcon = document.querySelector(".fas.fa-eye");
          eyeIcon.addEventListener("click", () => {
            togglePassword(passwordInput, eyeIcon);
          });
          document.querySelector(".back")?.addEventListener("click", () => {
            restoreRow();
          });
        })
        .catch((err) => console.log(err));
    });
  });
  ////add
  document.querySelector(".btnadd")?.addEventListener("click", async () => {
    console.log("add");

    const rolesList = await getRoles();
    content.innerHTML = createUserDetailHTML(
      {},
      false,
      true,
      "Thêm người dùng",
      roles || [],
      rolesList
    );

    const passwordInput = document.getElementById("password");
    const eyeIcon = document.querySelector(".fas.fa-eye");
    eyeIcon.addEventListener("click", () => {
      togglePassword(passwordInput, eyeIcon);
    });
    document.querySelector(".back")?.addEventListener("click", () => {
      restoreRow();
    });
  });
}

///bang
function createUserDetailHTML(
  {
    _id = "",
    avata = "",
    name = "",
    email = "",
    location = "",
    phone_number = "",
    user_name = "",
    password = "",
  },
  isReadonly = false,
  showSaveButton = false,
  title,
  roles,
  rolesList
) {
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${
        _id ? `saveEditUser('${_id}')` : "saveAddUser()"
      }">Lưu</button>`
    : "";
  const readonlyAttr = isReadonly ? "readonly" : "";
  // Hàm kiểm tra xem vai trò có trong danh sách vai trò của người dùng không
  console.log(roles, "heheh");
  function isRoleChecked(roleId) {
    return Array.isArray(roles) && roles.some((role) => role._id === roleId);
  }

  console.log(rolesList, "rolesList");
  const roleCheckboxes = rolesList
    .map(
      (role) => `
     <label>
       <input type="checkbox" name="option" value="${role._id}" ${
        isRoleChecked(role._id) ? "checked" : ""
      }>
       ${role.name}
     </label><br>
   `
    )
    .join("");
  return /*html*/ `
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="flex">
      <div class="w-1/4 flex justify-center items-center">
        <img alt="User avatar" class="w-32 h-32 rounded-full" src="${avata}" />
      </div>
      <div class="w-3/4">
        <div class="grid grid-cols-2 gap-4">
          <div>
             <label class="block text-sm font-medium text-gray-700" for="id">Loại người dùng</label>
             <form id="roles-form">
                ${roleCheckboxes}
            </form>
           </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="name">Tên</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${name}" ${readonlyAttr} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="email">Email</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="email" type="email" value="${email}" ${readonlyAttr} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="address">Địa chỉ</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="address" type="text" value="${location}" ${readonlyAttr} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="phone">Số điện thoại</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="phone" type="text" value="${phone_number}" ${readonlyAttr} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="username">Tên người dùng (tài khoản)</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="username" type="text" value="${user_name}" ${readonlyAttr} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="password">Mật khẩu</label>
            <div class="relative mt-1">
              <input class="block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10" id="password" type="password" value="${password}" ${readonlyAttr} />
              <i class="fas fa-eye absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer" onclick="togglePassword()"></i>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700" for="avatar-link">Link avatar</label>
          <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="avatar-link" type="text" value="${avata}" ${readonlyAttr} />
        </div>
        <div class="mt-4">
         ${saveButtonHTML}
          <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="restoreRow()">Quay lại</button>
        </div>
      </div>
    </div>
  `;
}

// console.log(datagetListUser, "dataget");
//luu edit
async function saveEditUser(_id) {
  console.log(_id, "saveEditUser");

  // Thu thập dữ liệu từ các trường input
  const updatedUser = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    location: document.getElementById("address").value,
    phone_number: document.getElementById("phone").value,
    user_name: document.getElementById("username").value,
    password: document.getElementById("password").value,
    avata: document.getElementById("avatar-link").value,
  };

  // Lấy các vai trò đã chọn từ checkbox
  const selectedRoles = Array.from(
    document.querySelectorAll('input[name="option"]:checked')
  ).map((checkbox) => checkbox.value);

  // Lấy các vai trò hiện tại của người dùng từ server
  const currentRoles = await getAllUsersWithRoles(_id); // Lấy các vai trò hiện tại của người dùng từ server

  // Kiểm tra xem currentRoles có phải là mảng không
  if (!Array.isArray(currentRoles)) {
    console.error("currentRoles không phải là một mảng:", currentRoles);
    return; // Dừng việc xử lý nếu dữ liệu không hợp lệ
  }

  if (currentRoles.length === 0) {
    for (const roleId of selectedRoles) {
      await addRolesUser(_id, roleId); // Gọi hàm thêm vai trò
    }
  } else {
    // Nếu người dùng có vai trò, thực hiện thêm và xóa vai trò
    // Thêm vai trò mới nếu vai trò checkbox chưa có trong currentRoles
    for (const roleId of selectedRoles) {
      const isRoleAlreadyAssigned = currentRoles.some(
        (role) => role._id === roleId
      );
      if (!isRoleAlreadyAssigned) {
        await addRolesUser(_id, roleId); // Gọi hàm thêm vai trò
      }
    }

    // Xóa vai trò nếu vai trò checkbox không còn được chọn
    for (const role of currentRoles) {
      if (!selectedRoles.includes(role._id)) {
        await removeRolesUser(_id, role._id); // Gọi hàm xóa vai trò
      }
    }
  }

  // Cập nhật thông tin người dùng
  updatedUser.roles = selectedRoles; // Thêm danh sách vai trò vào đối tượng người dùng

  fetch(`${url}/updateuser/${_id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedUser),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        alert("Cập nhật người dùng thành công!");
        restoreRow(); // Gọi lại hàm này để hiển thị bảng người dùng sau khi cập nhật
      } else {
        alert("Cập nhật thất bại. Vui lòng thử lại.");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật người dùng:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    });
}

///luu them moi
async function saveAddUser() {
  console.log("Thêm mới");
  // Lấy dữ liệu từ form
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const location = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const user_name = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const avatar = document.getElementById("avatar-link").value.trim();

  // Validate các trường nhập liệu
  if (!name) {
    alert("Tên không được để trống.");
    return;
  }

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    alert("Email không hợp lệ.");
    return;
  }

  if (!location) {
    alert("Địa chỉ không được để trống.");
    return;
  }

  if (!phone || !/^\d{10,15}$/.test(phone)) {
    alert("Số điện thoại phải là số từ 10 đến 15 chữ số.");
    return;
  }

  if (!user_name) {
    alert("Tên đăng nhập không được để trống.");
    return;
  }

  if (!password || password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  if (!avatar || !/^(http|https):\/\/[^ "]+$/.test(avatar)) {
    alert(
      "Link avatar không hợp lệ. Hãy chắc chắn rằng nó bắt đầu bằng http hoặc https."
    );
    return;
  }

  // Lấy các checkbox được chọn (validate ít nhất 1 vai trò)
  const checkboxes = document.querySelectorAll('input[name="option"]:checked');
  const selectedValues = Array.from(checkboxes).map((cb) => cb.value);
  if (selectedValues.length === 0) {
    alert("Hãy chọn ít nhất một vai trò.");
    return;
  }

  // Dữ liệu hợp lệ, tiếp tục tạo đối tượng newUser
  const newUser = {
    name,
    email,
    location,
    phone_number: phone,
    user_name,
    password,
    avata: avatar,
  };

  try {
    // Gửi yêu cầu để tạo người dùng mới
    const userResponse = await fetch(`${url}/adduser`, {
      method: "POST",
      headers,
      body: JSON.stringify(newUser),
    });

    const userData = await userResponse.json();
    if (userResponse.ok && userData.status && userData.result._id) {
      const userId = userData.result._id;
      // console.log("Thêm người dùng thành công! User ID:", userId);

      // Gửi vai trò đã chọn lên server
      const userRolePromises = selectedValues.map((roleId) => {
        const userRoleData = {
          user_id: userId,
          role_id: roleId,
        };
        return fetch(`http://localhost:3000/userRole/adduser_role`, {
          method: "POST",
          headers,
          body: JSON.stringify(userRoleData),
        });
      });

      await Promise.all(userRolePromises);
      alert("Thêm người dùng và vai trò thành công!");
      restoreRow();
    } else {
      alert("Thêm người dùng thất bại. Vui lòng thử lại.");
    }
  } catch (err) {
    console.error("Lỗi khi thêm người dùng hoặc vai trò:", err);
    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
}
async function getAllUsersWithRoles(id) {
  // console.log(id, "user");
  try {
    const response = await fetch(
      `http://localhost:3000/userRole/getAllUsersWithRoles`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    // console.log(data.result, "InvoiceDetail");
    const userRole = data.result.find((userRole) => userRole.user._id === id);
    if (userRole) {
      // console.log(userRole.roles, "Tên người dùng");
      return userRole.roles;
    } else {
      console.log("User không tồn tại");
      return [];
    }
  } catch (err) {
    console.log(err);
    return "";
  }
}
/////
async function getRoles() {
  try {
    const response = await fetch("http://localhost:3000/role/getListRole", {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();
    if (Array.isArray(data)) {
      console.log(data, "Roles");
      return data; // trả về danh sách vai trò
    } else {
      console.error("Invalid data format for roles", data);
      return []; // trả về mảng trống nếu dữ liệu không đúng
    }
  } catch (err) {
    console.error("Error fetching roles:", err);
    return [];
  }
}
///
async function removeRolesUser(userId, roleId) {
  try {
    const response = await fetch(
      `http://localhost:3000/userRole/user_roles/${userId}/remove`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ role_id: roleId }), // Gửi roleId trong body để xóa vai trò
      }
    );
    const data = await response.json();
    console.log(data, "removeRolesUser");
    return data;
  } catch (err) {
    console.error("Error removing role:", err);
    return null;
  }
}

async function addRolesUser(userId, roleId) {
  try {
    const response = await fetch(
      `http://localhost:3000/userRole/user_roles/${userId}/add`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ role_id: roleId }), // Gửi roleId trong body để thêm vai trò
      }
    );
    const data = await response.json();
    console.log(data, "addRolesUser");
    return data;
  } catch (err) {
    console.error("Error adding role:", err);
    return null;
  }
}

////hienmk
const togglePassword = (passwordInput, eyeIcon) => {
  if (!passwordInput || !eyeIcon) {
    console.error("Password input or eye icon not found");
    return; // Dừng hàm nếu không có các phần tử cần thiết
  }

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
};

////back
function restoreRow() {
  getListUser();
}
getListUser();
