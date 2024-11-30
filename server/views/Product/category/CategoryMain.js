const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getList = async () => {
  const loadingDialog = dialogLoading("Đang tải ...");
  try {
    const response = await fetch(`${url}/category/getListCategory`, {
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
          <th class="border border-gray-300 px-4 py-2">Tên loại sản phẩm</th>
          <th class="border border-gray-300 px-4 py-2">Hình ảnh</th>

          <th class="border border-gray-300 px-4 py-2">Hành động</th>
        </tr>
      </thead>
      <tbody id="dataList">
        
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
  const tableBody = document.getElementById("dataList");
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
          <td class="border border-gray-300 px-4 py-2">${item.name}</td>
          <td class="border border-gray-300 px-4 py-2"> 
            <div class=" h-[220px]  flex justify-center items-center ">
                  <img
                    alt="Product image"
                    class="w-full h-full object-contain"
                    src="${item.image}"
                  />
                </div></td>
          <td class="border border-gray-300 px-4 py-2">
            <div class="button-group flex flex-col space-y-2">
              <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${item._id
          }">Cập nhật</button>
              <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${item._id
          }">Xóa</button>
              <!-- <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${item._id
          }">Chi tiết</button> -->
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
  // document
  //   .querySelectorAll(".btndetail")
  //   .forEach((btn) =>
  //     btn.addEventListener("click", () => handleDetail(btn.dataset.id))
  //   );
  document
    .querySelectorAll(".btnedit")
    .forEach((btn) =>
      btn.addEventListener("click", () => handleEdit(btn.dataset.id))
    );
  document
    .querySelector(".btnadd")
    ?.addEventListener("click", () =>
      renderDetailForm({}, false, true, "Thêm loại sản phẩm")
    );
};

const handleDelete = async (id) => { 
  const checkcategotry=await CheckCategoryByID(id)
  if(checkcategotry.length>0){
    dialogWarning("Loại sản phẩm đang được dùng trong sản phẩm, không thể xóa")
    return
  }
 dialogDelete("Xóa loại sản phẩm", "Bạn có chắc chắn muốn xóa sản phẩm này?", async () => {
    try {
      await fetch(`${url}/category/deletecategory/${id}`, { method: "DELETE", headers });
      getList();
    } catch (err) {
      dialogError("Xóa thất bại", "")
      console.log(err);
    }
  })
};

// const handleDetail = async (id) => {
//   try {
//     const response = await fetch(`${url}/category/getcategoryById/${id}`, { headers });
//     const data = await response.json();
//     console.log(data, "getRoleById");
//     renderDetailForm(data.result, true, false, "Chi tiết loại sản phẩm");
//   } catch (err) {
//     console.log(err);
//   }
// };

const handleEdit = async (id) => {
  try {
    const response = await fetch(`${url}/category/getcategoryById/${id}`, { headers });
    const data = await response.json();
    console.log(data, "getRoleById----edit");
    renderDetailForm(data.result, false, true, "Cập nhật người dùng");
  } catch (err) {
    console.log(err);
  }
};

const renderDetailForm = (
  data = {},
  isReadonly = false,
  showSaveButton = false,
  title = ""
) => {
  const { _id = "", name = "", image = "" } = data;
  const readonlyAttr = isReadonly ? "readonly" : "";
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save m-e10" onclick="${_id ? `saveEdit('${_id}')` : "saveAdd()"
    }">Lưu</button>`
    : "";

  content.innerHTML = /*html*/ `
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="flex">
      <div class="w-1/4"><label class="block text-sm font-medium text-gray-700" >Tên loại sản phẩm</label>
        <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="name" type="text" value="${name}" ${readonlyAttr} />
      </div>
      <div class="w-3/4"><label class="block text-sm font-medium text-gray-700" >Link ảnh sản phẩm</label>
        <textarea class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="image" type="text" ${readonlyAttr}>${image} </textarea>
      </div>
    </div>
    <div class="mt-4">${saveButtonHTML}<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button></div>`;
};

const saveEdit = async (_id) => {
  const namevalues = document.getElementById("name").value
  const image = document.getElementById("image").value
  const update = {
    name: namevalues,
    image: image,
  };
 
  if (!namevalues ) {
    dialogError("Tên loại người dùng không được để trống")
    return
  }
  if (!image ) {
    dialogError("Link ảnh không được để trống")
    return
  }
  dialogInfo("Bạn có muốn lưu các thay đổi không?"
    , async () => {
      const loadingDialog = dialogLoading("Đang tải lên...");
      try {
        const response = await fetch(`${url}/category/updatecategory/${_id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(update),
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
  const namevalues = document.getElementById("name").value
  const image = document.getElementById("image").value
  const newdata = {
    name: namevalues,
    image: image,
  };
 
  if (!namevalues ) {
    dialogError("Tên loại người dùng không được để trống")
    return
  }
  if (!image ) {
    dialogError("Link ảnh không được để trống")
    return
  }
  dialogInfo("Bạn có muốn lưu không?"
    , async () => {
      const loadingDialog = dialogLoading("Đang tải lên...");
      try {
        const response = await fetch(`${url}/category/addcategory`, {
          method: "POST",
          headers,
          body: JSON.stringify(newdata),
        });
        const data = await response.json();
        if (data.status) {
          dialogSuccess("Thêm thành công!").then(() => {
           getList();   // Chỉ gọi sau khi thông báo xong
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
async function CheckCategoryByID(id) {
  // console.log(id, "user");
  try {
    const response = await fetch(
      `${url}/productCategory/get-ProductCategory-By-CategoryId/${id}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    console.log(data.result, "categories");
      return data.result;
    // if (userRole) {
    //   // console.log(userRole.roles, "Tên người dùng");
    //   return userRole.roles;
    // } else {
    //   console.log("User không tồn tại");
    //   return [];
    // }
  } catch (err) {
    console.log(err);
    return [];
  }
}
getList();
