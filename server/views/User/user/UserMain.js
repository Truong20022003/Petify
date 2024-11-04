const content = document.querySelector(".shadow");
console.log(content);
let url = "http://localhost:3000/user";
let tbody = document.querySelector("tbody");
let table = document.querySelector("table");
const getListUser = () => {
  fetch(`${url}/getListUser`,{
    method: "GET",
    headers: {
      "Authorization": "trinh_nhung",
       "Content-Type": "application/json"
  }
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      content.innerHTML =
        `<div class="flex mb-4">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded mr-2 btnadd">
              Thêm mới
            </button>
            <input
              class="border border-gray-300 rounded px-4 py-2 flex-grow"
              placeholder="Tìm kiếm"
              type="text"
            />
            <button class="bg-yellow-500 text-white px-4 py-2 rounded ml-2">
              TÌm kiếm
            </button>
          </div>
          <table class="content w-full border-collapse">
            <thead>
              <tr class="bg-yellow-500 text-white">
                <th class="border border-gray-300 px-4 py-2">STT</th>
                <th class="border border-gray-300 px-4 py-2">Tên người dùng</th>
                <th class="border border-gray-300 px-4 py-2">Email</th>
                <th class="border border-gray-300 px-4 py-2">Địa chỉ</th>
                <th class="border border-gray-300 px-4 py-2">Số điện thoại</th>
                <th class="border border-gray-300 px-4 py-2">Ảnh</th>
                <th class="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>` +
        data
          .map(
            (item, index) => `<tr id="row-${item._id}">
                <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
                <td class="border border-gray-300 px-4 py-2">${item.name}</td>
                <td class="border border-gray-300 px-4 py-2">${item.email}</td> 
                <td class="border border-gray-300 px-4 py-2">${
                  item.location
                }</td>
                <td class="border border-gray-300 px-4 py-2">${
                  item.phone_number
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
      /////xoa
      document.querySelectorAll(".btndelete").forEach((btn) => {
        btn.addEventListener("click", () => {
          console.log("delete");
          id = btn.dataset.id;
          console.log(id);
          if (confirm("ban co chac muon xoa khong")) {
            fetch(`${url}/deleteuser/${id}`, { method: "DELETE",
              headers: {
                "Authorization": "trinh_nhung",
                 "Content-Type": "application/json"
            }
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
          fetch(`${url}/getuserById/${id}`,{
            method: "GET",
            headers: {
              "Authorization": "trinh_nhung",
               "Content-Type": "application/json"
          }
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data, "kkkk");
              content.innerHTML = createUserDetailHTML(
                data.result,
                true,
                false,
                "Chi tiết người dùng"
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
          fetch(`${url}/getuserById/${id}`,{
            headers: {
              "Authorization": "trinh_nhung",
               "Content-Type": "application/json"
          }
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data, "kkkk");
              content.innerHTML = createUserDetailHTML(
                data.result,
                false,
                true,
                "Cập nhật người dùng"
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
      document.querySelector(".btnadd")?.addEventListener("click", () => {
        console.log("add");
        content.innerHTML = createUserDetailHTML(
          {},
          false,
          true,
          "Thêm người dùng"
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

      ////
    });
};

///bang
function createUserDetailHTML(
  user = {}, // Accept an empty object for adding
  isReadonly = false,
  showSaveButton = false,
  title = ""
) {
  const {
    avata = "",
    _id = "",
    name = "",
    email = "",
    location = "",
    phone_number = "",
    user_name = "",
    password = "",
  } = user; // Destructure with default values

  const readonlyAttr = isReadonly ? "readonly" : "";

  // Condition to show the Save button
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${
        _id ? `saveEditUser('${_id}')` : "saveAddUser()"
      }">Lưu</button>`
    : "";

  return /*html*/`
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="flex">
      <div class="w-1/4 flex justify-center items-center">
        <img alt="User avatar" class="w-32 h-32 rounded-full" src="${avata}" />
      </div>
      <div class="w-3/4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="id">ID</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="id" type="text" value="${_id}" readonly />
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

//luu edit
function saveEditUser(_id) {
  console.log(_id, "hehehe");
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

  fetch(`${url}/updateuser/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "trinh_nhung",
    },
    body: JSON.stringify(updatedUser),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        alert("Cập nhật người dùng thành công!");
        restoreRow();
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
function saveAddUser() {
  console.log("Thêm mới");
  const newUser = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    location: document.getElementById("address").value,
    phone_number: document.getElementById("phone").value,
    user_name: document.getElementById("username").value,
    password: document.getElementById("password").value,
    avata: document.getElementById("avatar-link").value,
  };

  fetch(`${url}/adduser`, {
    // Adjust the URL as necessary
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "trinh_nhung",
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        alert("Thêm người dùng thành công!");
        restoreRow();
      } else {
        alert("Thêm thất bại. Vui lòng thử lại.");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi thêm người dùng:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    });
}

////hienmk
togglePassword = (passwordInput, eyeIcon) => {
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
