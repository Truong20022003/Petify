const content = document.querySelector(".shadow");
let url = "http://localhost:3000/product";
let tbody = document.querySelector("tbody");

const getListProduct = () => {
  fetch(`${url}/getListProduct`, {
    method: "GET",
    headers: {
      Authorization: "trinh_nhung",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      content.innerHTML =
        /*html*/ ` <div class="flex mb-4">
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
                <th class="border border-gray-300 px-4 py-2">Mã sản phẩm</th>
                <th class="border border-gray-300 px-4 py-2">Tên</th>
                <th class="border border-gray-300 px-4 py-2">Loại sản phẩm</th>
                <th class="border border-gray-300 px-4 py-2">Giá</th>
                <th class="border border-gray-300 px-4 py-2">Trạng thái</th>
                <th class="border border-gray-300 px-4 py-2">Hạn sử dụng</th>
                <th class="border border-gray-300 px-4 py-2">Ảnh</th>
                <th class="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>` +
        data
          .map(
            (item, index) => /*html*/ `<tr id="row-${item._id}">
                <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
                <td class="border border-gray-300 px-4 py-2">${item._id}</td>
                <td class="border border-gray-300 px-4 py-2">${item.name}</td>
                <td class="border border-gray-300 px-4 py-2">loaij san pham</td>
                <td class="border border-gray-300 px-4 py-2">${item.price}</td>
                <td class="border border-gray-300 px-4 py-2">${item.status}</td>
                <td class="border border-gray-300 px-4 py-2">${item.date}</td>
                <td class="border border-gray-300 px-4 py-2">
                   <img
                    alt="Product image"
                    class="w-12 h-12"
                    height="50"
                    src="${item.image[0]}"
                    width="100"
                  />
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
      addEventListeners();
    });
};
///
const addEventListeners = () => {
  document.querySelectorAll(".btndelete").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("delete");
      id = btn.dataset.id;
      console.log(id);
      if (confirm("ban co chac muon xoa khong")) {
        fetch(`${url}/deleteproduct/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: "trinh_nhung",
            "Content-Type": "application/json",
          },
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
      fetch(`${url}/getproductById/${id}`, {
        method: "GET",
        headers: {
          Authorization: "trinh_nhung",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "kkkk");
          content.innerHTML = createProductDetailHTML(
            data.result,
            true,
            false,
            "Chi tiết Sản phẩm"
          );
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
      fetch(`${url}/getproductById/${id}`, {
        method: "GET",
        headers: {
          Authorization: "trinh_nhung",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "kkkk");
          content.innerHTML = createProductDetailHTML(
            data.result,
            false,
            true,
            "Cập san pham"
          );
          ////

          ///
          handleImageUpload(data.result.image);
          ///
          document.querySelector(".back")?.addEventListener("click", () => {
            restoreRow();
          });
        })
        .catch((err) => console.log(err));
    });
  });
  /////
  ///add
  document.querySelector(".btnadd")?.addEventListener("click", () => {
    console.log("add");
    const selectedFiles = [];

    content.innerHTML = createProductDetailHTML(
      {},
      false,
      true,
      "Thêm người san pham"
    );
    ////
    handleImageUploadAdd(selectedFiles);
    ///
    document
      .getElementById("upload-btn")
      .addEventListener("click", async function () {
        if (selectedFiles.length === 0) {
          alert("Vui lòng chọn ít nhất một ảnh!");
          return;
        }

        // Dữ liệu ảo từ form (bạn có thể thay thế bằng các giá trị thực tế từ input)
        const name = "doando";
        const supplier_id = "671da9ba08f0a23211562a9d";
        const price = 2424;
        const date = "ewewe";
        const expiry_Date = "sfsfs";
        const quantity = 34343;
        const status = "sfsfs";
        const description = "dfsf";
        const sale = 3434;

        // Tạo đối tượng FormData
        const formData = new FormData();
        // Thêm dữ liệu ảo vào FormData
        formData.append("name", name);
        formData.append("supplier_id", supplier_id);
        formData.append("price", price);
        formData.append("date", date);
        formData.append("expiry_Date", expiry_Date);
        formData.append("quantity", quantity);
        formData.append("status", status);
        formData.append("description", description);
        formData.append("sale", sale);

        // Thêm tất cả ảnh vào FormData (bao gồm tất cả file trong selectedFiles)
        selectedFiles.forEach((file) => {
          formData.append("image", file); // "image" có thể thay đổi thành "images" nếu server yêu cầu
        });

        for (var pair of formData.entries()) {
          if (pair[0] === "image") {
            console.log(`${pair[0]}: ${pair[1].name}, ${pair[1].size} bytes`); // Log chi tiết về ảnh
          } else {
            console.log(pair[0] + ": " + pair[1]);
          }
        }
        const data = await addProduct(formData);
        console.log("Upload result:", data); // Kiểm tra kết quả từ server

        if (data.success) {
          alert("Thêm sản phẩm thành công");
        } else {
          alert("Thêm sản phẩm thất bại");
        }
      });
    ///
    document.querySelector(".back")?.addEventListener("click", () => {
      restoreRow();
    });
  });
};

async function addProduct(formData) {
  try {
    const response = await fetch(`${url}/addproduct`, {
      method: 'POST',
      headers: {
        'Authorization': 'trinh_nhung',
      },
      body: formData,
    });

    // Kiểm tra nếu phản hồi OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Đọc dữ liệu JSON từ phản hồi
    const data = await response.json();
    console.log("Data from server:", data);

    return data;
  } catch (err) {
    console.error("Error in addProduct:", err);
    return { success: false, message: err.message };
  }
}

///bang
function createProductDetailHTML(
  product = {}, // Accept an empty object for adding
  isReadonly = false,
  showSaveButton = false,
  title = ""
) {
  const {
    image = [], // Danh sách hình ảnh
    _id = "",
    name = "",
    supplier_id = "",
    price = "",
    date = "",
    expiry_Date = "",
    quantity = "",
    status = "",
    description = "",
    sale = "",
  } = product;
  console.log(_id);
  const readonlyAttr = isReadonly ? "readonly" : "";

  const saveButtonHTML = showSaveButton
    ? `<button id="upload-btn" class="bg-green-500 text-white px-4 py-2 rounded save" onclick="saveEditProduct('${_id}')">Lưu</button>
`
    : "";

  return /*html*/ `
   <style>
      .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          cursor: pointer;
          background-color: red;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
      }
    </style>
    <h2 class="text-xl font-bold mb-4">${title}</h2>
    <div class="flex">
      <div class="w-3/4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="id">ID</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="id" type="text" value="${_id}" ${readonlyAttr} />
          </div>
        </div>
        <div class="container mx-auto">
          <h1 class="text-2xl font-bold mb-4">Chọn ảnh từ desktop</h1>
          <input type="file" id="file-input" multiple accept="image/*" class="mb-4" />
          <div id="image-container" class="flex flex-wrap gap-4 overflow-y-scroll h-64 w-[500px] border border-gray-300 p-2">
            ${image
              .map(
                (imgSrc) => /*html*/ `
              <div class="relative w-32 h-32 m-2 inline-block">
                <img alt="Product Image" class="w-full h-full object-cover rounded-md" src="${imgSrc}" />
                <button class="remove-btn">X</button>
              </div>
            `
              )
              .join("")}
          </div>
        <div class="mt-4">
         ${saveButtonHTML}
          <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="restoreRow()">Quay lại</button>
        </div>
      </div>
    </div>
  `;
}
///
//luu edit

////back
function restoreRow() {
  getListProduct();
}
/////

//////

getListProduct();
