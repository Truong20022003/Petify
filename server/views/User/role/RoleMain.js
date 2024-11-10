const content = document.querySelector(".shadow");
let url = "http://localhost:3000/role";

const getListUser = () => {
  fetch(`${url}/getListRole`, {
    method: "GET",
    headers: {
      Authorization: "trinh_nhung",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // Create the table header and content
      content.innerHTML = /*html*/ `
      <div class="flex mb-4">
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
            <th class="border border-gray-300 px-4 py-2">ID Role</th>
            <th class="border border-gray-300 px-4 py-2">Name</th>
            <th class="border border-gray-300 px-4 py-2">Description</th>
            <th class="border border-gray-300 px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (item, index) => /*html*/ `
            <tr id="row-${item._id}">
              <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
              <td class="border border-gray-300 px-4 py-2">${item._id}</td>
              <td class="border border-gray-300 px-4 py-2">${item.name}</td>
              <td class="border border-gray-300 px-4 py-2">${
                item.description
              }</td>
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
            .join("")}
        </tbody>
      </table>`;

      // Add event listeners for update, delete, and detail
      addEventListeners();
    })
    .catch((err) => console.log(err));
};

function addEventListeners() {
  // Delete button
  document.querySelectorAll(".btndelete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (confirm("Bạn có chắc muốn xóa không?")) {
        fetch(`${url}/deleterole/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: "trinh_nhung",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(() => {
            alert("Xóa thành công!");
            getListUser();
          })
          .catch((err) => console.log(err));
      }
    });
  });

  // Detail button
  document.querySelectorAll(".btndetail").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      fetch(`${url}/getRoleById/${id}`)
        .then((response) => response.json())
        .then((data) => {
          content.innerHTML = createUserDetailHTML(
            data.result,
            true,
            false,
            "Chi tiết người dùng"
          );
          const passwordInput = document.getElementById("password");
          const eyeIcon = document.querySelector(".fas.fa-eye");
          eyeIcon.addEventListener("click", () =>
            togglePassword(passwordInput, eyeIcon)
          );
          document
            .querySelector(".back")
            ?.addEventListener("click", () => getListUser());
        })
        .catch((err) => console.log(err));
    });
  });

  // Edit button
  document.querySelectorAll(".btnedit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      fetch(`${url}/getRoleById/${id}`)
        .then((response) => response.json())
        .then((data) => {
          content.innerHTML = createUserDetailHTML(
            data.result,
            false,
            true,
            "Cập nhật người dùng"
          );
          const passwordInput = document.getElementById("password");
          const eyeIcon = document.querySelector(".fas.fa-eye");
          eyeIcon.addEventListener("click", () =>
            togglePassword(passwordInput, eyeIcon)
          );
          document
            .querySelector(".back")
            ?.addEventListener("click", () => getListUser());
        })
        .catch((err) => console.log(err));
    });
  });

  // Add new role
  document.querySelector(".btnadd")?.addEventListener("click", () => {
    content.innerHTML = createUserDetailHTML(
      {},
      false,
      true,
      "Thêm người dùng"
    );
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.querySelector(".fas.fa-eye");
    eyeIcon.addEventListener("click", () =>
      togglePassword(passwordInput, eyeIcon)
    );
    document
      .querySelector(".back")
      ?.addEventListener("click", () => getListUser());
  });
}

// Create user detail HTML form
function createUserDetailHTML(
  user = {},
  isReadonly = false,
  showSaveButton = false,
  title = ""
) {
  const { _id = "", name = "", description = "" } = user;
  const readonlyAttr = isReadonly ? "readonly" : "";

  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${
        _id ? `saveEditUser('${_id}')` : "saveAddUser()"
      }">Lưu</button>`
    : "";

  return /*html*/ `
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="flex">
      <div class="w-1/4">
        <label class="block text-sm font-medium text-gray-700" for="name">Tên Role</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${name}" ${readonlyAttr} />
      </div>
      <div class="w-3/4">
        <label class="block text-sm font-medium text-gray-700" for="description">Mô tả</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="description" type="text" value="${description}" ${readonlyAttr} />
      </div>
    </div>
    <div class="mt-4">
      ${saveButtonHTML}
      <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getListUser()">Quay lại</button>
    </div>
  `;
}

// Save updated user role
function saveEditUser(_id) {
  const updatedRole = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
  };

  fetch(`${url}/updaterole/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "trinh_nhung",
    },
    body: JSON.stringify(updatedRole),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        alert("Cập nhật role thành công!");
        getListUser();
      } else {
        alert("Cập nhật thất bại. Vui lòng thử lại.");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật role:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    });
}

// Save new role
function saveAddUser() {
  const newRole = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
  };

  fetch(`${url}/addRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "trinh_nhung",
    },
    body: JSON.stringify(newRole),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        alert("Thêm role thành công!");
        getListUser();
      } else {
        alert("Thêm thất bại. Vui lòng thử lại.");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi thêm role:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    });
}

// Toggle password visibility
function togglePassword(inputElement, eyeIcon) {
  if (inputElement.type === "password") {
    inputElement.type = "text";
    eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    inputElement.type = "password";
    eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

getListUser(); // Initialize the list of users on page load
