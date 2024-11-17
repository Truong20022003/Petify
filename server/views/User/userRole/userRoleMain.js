const content = document.querySelector(".shadow");
console.log(content);
let url = "http://localhost:3000/userRole";
let tbody = document.querySelector("tbody");
let table = document.querySelector("table");

const getList = async () => {
  try {
    const response = await fetch(`${url}/getListUserRole`, {
      method: "GET",
      headers: {
        Authorization: "trinh_nhung",
      },
    });

    const data = await response.json();

    const namesuser = await Promise.all(
      data.map((item) => checkUser(item.user_id))
    );
    const namesrole = await Promise.all(
      data.map((item) => checkRole(item.role_id))
    );
    
    content.innerHTML = /*html*/ `<div class="flex mb-4">
            <!-- <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">
              Thêm mới
            </button> -->
            <input
              class="border border-gray-300 rounded px-4 py-2 flex-grow"
              placeholder="Tìm kiếm"
              type="text"
            />
            <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2">
              Tìm kiếm
            </button>
          </div>
          <table class="content w-full border-collapse">
            <thead>
              <tr class="bg-[#396060] text-white">
                <th class="border border-gray-300 px-4 py-2">STT</th>
                <th class="border border-gray-300 px-4 py-2">id userRole</th>
                <th class="border border-gray-300 px-4 py-2">name role</th>
                <th class="border border-gray-300 px-4 py-2">name user</th>
                <th class="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (item, index) => /*html*/ `<tr id="row-${item._id}">
                      <td class="border border-gray-300 px-4 py-2">${
                        index + 1
                      }</td>
                      <td class="border border-gray-300 px-4 py-2">${
                        item._id
                      }</td>
                      <td class="border border-gray-300 px-4 py-2">${
                        namesrole[index]
                      }</td> 
                      <td class="border border-gray-300 px-4 py-2">${
                        namesuser[index]
                      }</td>
                      <td class="border border-gray-300 px-4 py-2">
                        <div class="button-group flex flex-col space-y-2">
                          <!-- <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${
                            item._id
                          }">Cập nhật</button> -->
                          <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${
                            item._id
                          }">Xóa</button> 
                          <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${
                            item._id
                          }">Chi tiết</button>
                        </div>
                      </td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>`;

    // Đặt các sự kiện cho các nút
    setButtonEvents();
  } catch (error) {
    console.log("Error fetching user roles:", error);
  }
};

// Hàm checkUser sử dụng async/await để trả về tên người dùng
async function checkUser(id) {
  //   console.log(id, "checkuser");
  try {
    const response = await fetch(
      `http://localhost:3000/user/getuserById/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: "trinh_nhung",
        },
      }
    );

    const data = await response.json();
    // console.log(data.result, "datauser");

    const name = data.result.name;
    // console.log(name, "name");

    return name; // Trả về giá trị tên sau khi fetch thành công
  } catch (err) {
    console.log(err);
    return ""; // Trả về chuỗi rỗng nếu có lỗi
  }
}
async function checkRole(id) {
  //   console.log(id, "checkRole");
  try {
    const response = await fetch(
      `http://localhost:3000/role/getroleById/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: "trinh_nhung",
        },
      }
    );

    const data = await response.json();
    // console.log(data.result, "dataRole");

    const name = data.result.name;
    // console.log(name, "nameRole");

    return name; // Trả về giá trị tên sau khi fetch thành công
  } catch (err) {
    console.log(err);
    return ""; // Trả về chuỗi rỗng nếu có lỗi
  }
}
const setButtonEvents = () => {
  // Xử lý sự kiện xóa, chi tiết và cập nhật cho từng dòng trong bảng
  document.querySelectorAll(".btndelete").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("delete");
      const id = btn.dataset.id;
      if (confirm("Bạn có chắc muốn xóa không?")) {
        fetch(`${url}/deleteuser_role/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: "trinh_nhung",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(() => {
            alert("Xóa thành công");
            getList(); // Tải lại danh sách người dùng
          })
          .catch((err) => console.log(err));
      }
    });
  });

  document.querySelectorAll(".btndetail").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        const response = await fetch(`${url}/getuser_roleById/${id}`, {
          method: "GET",
          headers: {
            Authorization: "trinh_nhung",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        const userDetailHTML = await createUserDetailHTML(
          data.result,
          true,
          false,
          "Chi tiết user role"
        );

        content.innerHTML = userDetailHTML;
      } catch (err) {
        console.log(err);
      }
    });
  });

  document.querySelectorAll(".btnedit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      fetch(`${url}/updateuser_role/${id}`)
        .then((response) => response.json())
        .then((data) => {
          content.innerHTML = createUserDetailHTML(
            data.result,
            false,
            true,
            "Cập nhật user role"
          );
        })
        .catch((err) => console.log(err));
    });
  });

  document.querySelector(".btnadd")?.addEventListener("click", () => {
    content.innerHTML = createUserDetailHTML({}, false, true, "Thêm user role");
  });
};
async function createUserDetailHTML(
  user = {},
  isReadonly = false,
  showSaveButton = false,
  title = ""
) {
  const { _id = "", user_id = "", role_id = "" } = user;
  console.log(role_id, "bang");
  console.log(user_id, "bang");

  const readonlyAttr = isReadonly ? "readonly" : "";
  const namesuser = await checkUser(user_id);

  const namesrole = await checkRole(role_id);
  console.log(namesuser, "bang");
  console.log(namesrole, "bang");
  const saveButtonHTML = "";
  //   const saveButtonHTML = showSaveButton
  //     ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${
  //         _id ? `saveEditUser('${_id}')` : "saveAddUser()"
  //       }">Lưu</button>`
  //     : "";

  return /*html*/ `
      <h2 class="text-xl font-bold mb-4">${title}</h2>
      <div class="flex">
        <div class="w-1/4">
          <label class="block text-sm font-medium text-gray-700" for="name">Tên user id</label>
          <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${namesuser}" ${readonlyAttr} />
        </div>
        <div class="w-3/4">
          <label class="block text-sm font-medium text-gray-700" for="description">Tên role id</label>
          <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="description" type="text" value="${namesrole}" ${readonlyAttr} />
        </div>
      </div>
      <div class="mt-4">
        ${saveButtonHTML}
        <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
      </div>
    `;
}
getList(); // Gọi hàm để tải danh sách người dùng
