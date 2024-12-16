const content = document.querySelector(".shadow");
console.log(content);
let url = "http://localhost:3000/user";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};
let tbody = document.querySelector("tbody");
let table = document.querySelector("table");
const productsPerPage = 10;
let currentPage = 1;
let totalPages = 0;
let usersData = []; // Dữ liệu người dùng chưa được lọc
let rolesData = []; // Dữ liệu vai trò chưa được lọc
let filteredUsers = [];
// Cập nhật hàm getListUser để hỗ trợ phân trang
const getListUser = async () => {
  try {
    const loadingDialog = dialogLoading("Đang tải danh sách dữ liệu...");
    const response = await fetch(`${url}/getListUser`, {
      method: "GET",
      headers,
    });
    const data = await response.json();

    // Lấy danh sách `roles` cho từng người dùng
    rolesData = await Promise.all(
      data.map((item) => getAllUsersWithRoles(item._id))
    );

    // Lưu lại dữ liệu người dùng gốc
    usersData = data;
    // Cập nhật lại kết quả tìm kiếm khi tải dữ liệu lần đầu
    filteredUsers = data;
    // Tính toán tổng số trang
    // Hiển thị bảng với dữ liệu người dùng và vai trò
    content.innerHTML = /*html*/ `
      <div class="flex mb-4">
        <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button>
        <input id="searchInput" class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm" type="text" />
        <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2">Tìm kiếm</button>
      </div>
      <table class="content w-full border-collapse">
        <thead>
          <tr class="bg-[#396060] text-white">
            <th class="border border-gray-300 px-4 py-2">STT</th>
            <th class="border border-gray-300 px-4 py-2">Tên người dùng</th>
            <th class="border border-gray-300 px-4 py-2" style="width: 300px;">Loại người dùng</th>
            <th class="border border-gray-300 px-4 py-2">Email</th>
            <th class="border border-gray-300 px-4 py-2">Địa chỉ</th>
            <th class="border border-gray-300 px-4 py-2">Số điện thoại</th>
            <th class="border border-gray-300 px-4 py-2">Ảnh</th>
            <th class="border border-gray-300 px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody id="userList"></tbody>
      </table>
      <div class="pagination flex justify-between mt-4">
        <button id="prevPage" class="bg-[#008080] text-white px-4 py-2 rounded" disabled>Trang trước</button>
        <span id="pageInfo" class="text-gray-700">Trang 1 / ${totalPages}</span>
        <button id="nextPage" class="bg-[#008080] text-white px-4 py-2 rounded">Trang sau</button>
      </div>
    `;

    // Lắng nghe sự kiện tìm kiếm
    document.getElementById("searchInput").addEventListener("input", async (e) => {
      const query = e.target.value; // Lấy giá trị người dùng nhập
      filteredUsers = searchUser(query, usersData); // Tìm kiếm theo query trong danh sách người dùng

      // Cập nhật lại giao diện với kết quả tìm kiếm
      currentPage = 1; // Reset trang về 1 khi tìm kiếm lại
      renderUserList(filteredUsers, rolesData);
    });

    // Gọi hàm renderUserList để hiển thị tất cả người dùng khi load lần đầu
    renderUserList(filteredUsers, rolesData);
    // Cập nhật phân trang cho dữ liệu
    loadingDialog.close();
  } catch (error) {
    console.log("Error fetching user data:", error);
  }
};

// Hàm để render danh sách người dùng lên giao diện
function renderUserList(users, roles) {
  const tableBody = document.getElementById("userList");
  tableBody.innerHTML = ""; // Xóa các hàng cũ trong bảng trước khi thêm các kết quả mới

  // Cập nhật phân trang
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const usersToDisplay = users.slice(startIndex, endIndex);
  const rolesToDisplay = roles.slice(startIndex, endIndex);

  if (usersToDisplay.length === 0) {
    const noDataRow = /*html*/ `
      <tr>
        <td colspan="8" class="border border-gray-300 px-4 py-2 text-center text-red-500">
          Không có dữ liệu
        </td>
      </tr>`;
    tableBody.innerHTML = noDataRow; // Hiển thị thông báo "Không có dữ liệu"
  } else {
    // Nếu có người dùng trong kết quả tìm kiếm, hiển thị bảng bình thường
    usersToDisplay.forEach((user, index) => {
      const row = /*html*/ `
        <tr id="row-${user._id}">
          <td class="border border-gray-300 px-4 py-2">${startIndex + index + 1}</td>
          <td class="border border-gray-300 px-4 py-2">${user.name}</td>
          <td class="border border-gray-300 px-4 py-2">
            ${Array.isArray(rolesToDisplay[index]) && rolesToDisplay[index].length > 0
          ? rolesToDisplay[index]
            .map((role, index) => `<span class="role-item px-2 py-1 rounded mr-2 mt-2 mb-2">${role.name}</span>`)
            .join("")
          : "Không có vai trò"}
          </td>
          <td class="border border-gray-300 px-4 py-2">${user.email}</td>
          <td class="border border-gray-300 px-4 py-2">${user.location || ""}</td>
          <td class="border border-gray-300 px-4 py-2">${user.phone_number || ""}</td>
          <td class="border border-gray-300 px-4 py-2">
            <img alt="Product image" class="w-12 h-12" height="50" src="${user.avata}" width="50" />
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <div class="button-group flex flex-col space-y-2">
              <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${user._id}">Cập nhật</button>
              <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${user._id}">Chi tiết</button>
            </div>
          </td>
        </tr>`;
      tableBody.innerHTML += row;
    });
  }

  // Cập nhật thông tin phân trang

  page(filteredUsers.length, filteredUsers, rolesData);
  // Thiết lập lại các sự kiện cho các nút sau khi cập nhật giao diện
  setupEventListeners(roles);
}

// Thêm sự kiện cho các nút phân trang
const page = (totalItems, data, roles) => {
  const totalPages = Math.ceil(totalItems / productsPerPage);
  document.getElementById("pageInfo").innerText = `Trang ${currentPage} / ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderUserList(data, roles); // Cập nhật lại danh sách người dùng
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderUserList(data, roles); // Cập nhật lại danh sách người dùng
    }
  });
}

// Hàm tìm kiếm người dùng
function searchUser(query, users) {
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  // Lọc danh sách người dùng
  const filteredUsers = users.filter((user) => {
    const userNameNormalized = removeVietnameseTones(user.name.toLowerCase());
    return userNameNormalized.includes(queryNormalized);
  });

  return filteredUsers;
}

/////
function setupEventListeners(roles) {
  ///xoa
  document.querySelectorAll(".btndelete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      console.log("delete");
      const id = btn.dataset.id;
      console.log(id);
      const rolesList = await getUserRole();
      console.log(rolesList, "rolesList");
      const rolecheck = rolesList.find((role) => role.user_id === id);
      console.log(rolecheck, "rolecheck");
      if (rolecheck) {
        dialogError("Người dùng đang có 1 vai trò");
        return;
      }
      dialogDelete("Xóa loại người dùng", "Bạn có chắc chắn muốn xóa loại người dùng này?", async () => {
        try {
          await fetch(`${url}/deleteuser/${id}`, { method: "DELETE", headers });
          restoreRow();
        } catch (err) {
          dialogError("Xóa thất bại", "")
          console.log(err);
        }
      })

    });
  });
  /////chi tiet
  document.querySelectorAll(".btndetail").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("detail");
      const id = btn.dataset.id;
      console.log(id);
      fetch(`${url}/getuserById/${id}`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .then(async (data) => {
          // console.log(data, "kkkk");
          const roles = await getAllUsersWithRoles(data._id);
          const rolesList = await getRoles();
          dialogDetailUser(data)
          // createUserDetailHTML(
          //   data,
          //   true,
          //   false,
          //   "Chi tiết người dùng",
          //   roles || [],
          //   rolesList || []
          // );
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
      const id = btn.dataset.id;
      fetch(`${url}/getuserById/${id}`, {
        headers,
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log(data, "kkkk");
          const roles = await getAllUsersWithRoles(data._id);
          const rolesList = await getRoles();
          console.log(roles, "roles");
          createUserDetailHTML(
            data,
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
    createUserDetailHTML(
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
//
function searchUser(query, users) {
  // Hàm loại bỏ dấu trong chuỗi
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Chuyển cả chuỗi tìm kiếm và tên người dùng thành dạng không dấu và thường
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  // Lọc danh sách người dùng
  const filteredUsers = users.filter((user) => {
    // Loại bỏ dấu trong tên và so sánh không phân biệt chữ hoa/thường
    const userNameNormalized = removeVietnameseTones(user.name.toLowerCase());
    return userNameNormalized.includes(queryNormalized);
  });

  return filteredUsers;
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
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${_id ? `saveEditUser('${_id}')` : "saveAddUser()"
    }">Lưu</button>`
    : "";
  const readonlyAttr = isReadonly ? "readonly" : "";
  // Hàm kiểm tra xem vai trò có trong danh sách vai trò của người dùng không
  console.log(roles, "heheh");
  function isRoleChecked(roleId) {
    return Array.isArray(roles) && roles.some((role) => role._id === roleId);
  }
  const currentUserId = localStorage.getItem("currentUserId");
  const isSuperAdmin = currentUserId === "67167e654a449a86951a6fa9"; // ID của Super Admin
  const isEditingSuperAdmin = _id === "67167e654a449a86951a6fa9"; // Đang chỉnh sửa Super Admin
  const isEditingSelf = currentUserId === _id; // Đang chỉnh sửa chính tài khoản mình

  // Kiểm tra nếu tài khoản hiện tại là Super Admin và đang chỉnh sửa chính mình
  const isSuperAdminEditingSelf = isSuperAdmin && isEditingSelf;

  // Khóa các trường email, username, password nếu người dùng là Super Admin và đang chỉnh sửa chính mình hoặc nếu là Admin
  const editableFields = {
    email: (isSuperAdminEditingSelf || !isSuperAdmin) ? "readonly onclick='showError(\"email\")'" : "",
    username: (isSuperAdminEditingSelf || !isSuperAdmin) ? "readonly onclick='showError(\"username\")'" : "",
    password: (isSuperAdminEditingSelf || !isSuperAdmin) ? "readonly onclick='showError(\"password\")'" : "",
  };

  const roleCheckboxes = rolesList
    .map((role) => {
      const isAdminRole = role.name === "Admin";
      const isChecked = isRoleChecked(role._id);

      // Điều kiện khóa checkbox quyền Admin
      const shouldDisable =
        (isAdminRole && isEditingSuperAdmin) || // Super Admin không được bỏ chọn quyền Admin của mình
        (isAdminRole && !isSuperAdmin); // Người không phải Super Admin không được chỉnh quyền Admin

      return /*html*/ `
        <label>
          <input 
            type="checkbox" 
            name="option" 
            value="${role._id}" 
            ${isChecked ? "checked" : ""} 
            ${shouldDisable ? "disabled" : ""}>
          ${role.name}
        </label><br>
      `;
    })
    .join("");


  content.innerHTML = /*html*/ `
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="flex">
      <div class="w-1/4 flex justify-center items-center">
        <img  id="user-avatar" alt="User avatar" class="w-32 h-32 rounded-full" src="${avata}" />
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
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="email" type="email" value="${email}" ${editableFields.email} />
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
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="username" type="text" value="${user_name}" ${editableFields.username} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="password">Mật khẩu</label>
            <div class="relative mt-1">
              <input class="block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10" id="password" type="password" value="${password}" ${editableFields.password} />
              <i class="fas fa-eye absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer" onclick="togglePassword()"></i>
            </div>
          </div>
        </div>
        <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700" for="avatar-upload">Upload Avatar</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="avatar-upload" type="file" accept="image/*" />
        </div>
        <div class="mt-4">
         ${saveButtonHTML}
          <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="restoreRow()">Quay lại</button>
        </div>
      </div>
    </div>
  `
  document.getElementById('avatar-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      // Hiển thị ảnh đã chọn
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.getElementById('user-avatar');
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(file);

      // Lưu tệp đã chọn để sử dụng sau
      this.selectedFile = file;
    }
  });
}
function showError(field) {
  dialogError(`Bạn không đủ quyền hạn để sửa mục ${field}!`);
}

// console.log(datagetListUser, "dataget");
//luu edit
async function saveEditUser(_id) {
  console.log(_id, "saveEditUser");

  // Thu thập dữ liệu từ các trường input

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const location = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const user_name = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const fileInput = document.getElementById('avatar-upload');
  const file = fileInput.selectedFile;

  // Lấy các vai trò đã chọn từ checkbox
  const checkboxes = document.querySelectorAll('input[name="option"]:checked');
  const selectedValues = Array.from(checkboxes).map((cb) => cb.value);
  const selectedRoles = Array.from(
    document.querySelectorAll('input[name="option"]:checked')
  ).map((checkbox) => checkbox.value);
  console.log(selectedRoles, "selectedRoles")
  const currentRoles = await getAllUsersWithRoles(_id);
  if (!Array.isArray(currentRoles)) {
    console.error("currentRoles không phải là một mảng:", currentRoles);
    return;
  }

  if (selectedValues.length === 0) {
    dialogError("Hãy chọn ít nhất một vai trò.");
    return
  }

  // Cập nhật thông tin người dùng
  // Thêm danh sách vai trò vào đối tượng người dùng
  // Validate các trường nhập liệu
  if (!name) {
    dialogError("Tên không được để trống.");
    return;
  }

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    dialogError("Email không hợp lệ.");
    return;
  }

  if (!location) {
    dialogError("Địa chỉ không được để trống.");
    return;
  }

  if (!phone || !/^(?:\+84)?\d{9,12}$/.test(phone)) {
    dialogError("Số điện thoại phải có từ 10 đến 15 chữ số .");
    return;
  }


  if (!user_name) {
    dialogError("Tên đăng nhập không được để trống.");
    return;
  }

  if (!password || password.length < 6) {
    dialogError("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }



  // Lấy các checkbox được chọn (validate ít nhất 1 vai trò)
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("location", location);
  formData.append("phone_number", phone);
  formData.append("user_name", user_name);
  formData.append("password", password);
  formData.append("avata", file);
  formData.append("roles", selectedRoles);
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  dialogInfo("Bạn có muốn lưu các thay đổi không?"
    , async () => {
      const loadingDialog = dialogLoading("Đang tải danh sách sản phẩm...");

      try {
        const response = await fetch(`${url}/updateuser/${_id}`, {
          method: "PUT",
          headers: {
            Authorization: "trinh_nhung",
          },
          body: formData,
        });
        const data = await response.json();
        const idUser = localStorage.getItem("currentUserId");
        console.log(idUser, "idUser")
        if (idUser === _id) {
          updateUserInfo(data.result.name, data.result.avata)
        }

        if (data.status) {
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
          dialogSuccess("Cập nhật người dùng thành công!").then(() => {
            restoreRow(); // Chỉ gọi sau khi thông báo xong
          });
        } else {
          dialogError("Cập nhật thất bại. Vui lòng thử lại.")
        }
        loadingDialog.close();
      } catch (error) {
        console.error("Lỗi khi cập nhật role:", error);
        dialogError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    },
    () => {
      restoreRow();
    })

}
function updateUserInfo(newName, newAvatar) {
  // Cập nhật thông tin trong localStorage
  localStorage.setItem("loggedInUser", newName);
  localStorage.setItem("loggedInUserAvatar", newAvatar);

  // Cập nhật lại nội dung trên trang
  document.getElementById("nameuser").textContent = "Welcome, " + newName;
  document.getElementById("userAvatar").src = newAvatar;
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
  const fileInput = document.getElementById('avatar-upload');
  const file = fileInput.selectedFile;

  // Validate các trường nhập liệu
  if (!name) {
    dialogError("Tên không được để trống.");
    return;
  }

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    dialogError("Email không hợp lệ.");
    return;
  }

  if (!location) {
    dialogError("Địa chỉ không được để trống.");
    return;
  }

  if (!phone || !/^\d{10,15}$/.test(phone)) {
    dialogError("Số điện thoại phải là số từ 10 đến 15 chữ số.");
    return;
  }

  if (!user_name) {
    dialogError("Tên đăng nhập không được để trống.");
    return;
  }

  if (!password || password.length < 6) {
    dialogError("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  // if (!avatar || !/^(http|https):\/\/[^ "]+$/.test(avatar)) {
  //   dialogError(
  //     "Link avatar không hợp lệ. Hãy chắc chắn rằng nó bắt đầu bằng http hoặc https."
  //   );
  //   return;
  // }

  // Lấy các checkbox được chọn (validate ít nhất 1 vai trò)
  const checkboxes = document.querySelectorAll('input[name="option"]:checked');
  const selectedValues = Array.from(checkboxes).map((cb) => cb.value);
  if (selectedValues.length === 0) {
    dialogError("Hãy chọn ít nhất một vai trò.");
    return;
  }
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("location", location);
  formData.append("phone_number", phone);
  formData.append("user_name", user_name);
  formData.append("password", password);
  formData.append("avata", file);

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  // Dữ liệu hợp lệ, tiếp tục tạo đối tượng newUser
  // const newUser = {
  //   name,
  //   email,
  //   location,
  //   phone_number: phone,
  //   user_name,
  //   password,
  //   avata: avatar,
  // };

  dialogInfo("Bạn có muốn lưu không?"
    , async () => {
      const loadingDialog = dialogLoading("Đang thao tác...");
      try {
        // Gửi yêu cầu để tạo người dùng mới
        const userResponse = await fetch(`${url}/adduser`, {
          method: "POST",
          headers: {
            Authorization: "trinh_nhung",
          },
          body: formData,
        });

        const userData = await userResponse.json();

        // Kiểm tra phản hồi từ server và tạo người dùng thành công
        if (userResponse.ok && userData.status && userData.result._id) {
          const userId = userData.result._id;

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

          // Chờ tất cả các yêu cầu vai trò hoàn thành
          const userRoleResponses = await Promise.all(userRolePromises);

          // Kiểm tra xem tất cả các vai trò đã được gán thành công
          const allRolesAssigned = userRoleResponses.every(response => response.ok);

          if (allRolesAssigned) {
            dialogSuccess("Thêm người dùng và vai trò thành công!").then(() => {
              restoreRow(); // Chỉ gọi sau khi thông báo xong
            });
          } else {
            dialogError("Thêm vai trò thất bại!")
          }
        } else {
          dialogError("Thêm người dùng thất bại!")
        }
        loadingDialog.close();
      } catch (err) {
        // Xử lý lỗi khi thêm người dùng hoặc vai trò
        console.error("Lỗi khi thêm người dùng hoặc vai trò:", err);
        dialogError("Đã xảy ra lỗi!")
      }
    }
    , () => {
      restoreRow();
    })
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
    console.log(data.result, "getAllUsersWithRoles");
    const userRole = data.result.find((userRole) => userRole.user._id === id);
    console.log(userRole, "userRole")
    if (userRole) {
      console.log(userRole.roles, "Tên người dùng");
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
////
async function getUserRole() {
  // console.log(id, "user");
  try {
    const response = await fetch(
      `http://localhost:3000/userRole/getListUserRole`,
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
