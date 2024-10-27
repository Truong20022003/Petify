
const content = document.querySelector(".shadow");
let url = "http://localhost:3000/product";
let tbody = document.querySelector("tbody");

const getListProduct = () => {
  fetch(`${url}/getListProduct`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      content.innerHTML =
        /*html*/` <div class="flex mb-4">
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
            (item, index) => /*html*/`<tr id="row-${item._id}">
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
      document.querySelectorAll(".btndelete").forEach((btn) => {
        btn.addEventListener("click", () => {
          console.log("delete");
          id = btn.dataset.id;
          console.log(id);
          if (confirm("ban co chac muon xoa khong")) {
            fetch(`${url}/deleteproduct/${id}`, { method: "DELETE" })
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
          fetch(`${url}/getproductById/${id}`)
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
          fetch(`${url}/getproductById/${id}`)
            .then((response) => response.json())
            .then((data) => {
              console.log(data, "kkkk");
              content.innerHTML =
                `` +
                createProductDetailHTML(
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
    });
};
///
// Function to handle image upload logic

///bang
function createProductDetailHTML(
  product = {}, // Accept an empty object for adding
  isReadonly = false,
  showSaveButton = false,
  showChoose = false,
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

  const readonlyAttr = isReadonly ? "readonly" : "";

  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${
        _id ? `saveEditUser('${_id}')` : "saveAddUser()"
      }">Lưu</button>`
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
////back
function restoreRow() {
  getListProduct();
}
/////

//////

getListProduct();
