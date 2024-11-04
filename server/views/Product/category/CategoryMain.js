const content = document.querySelector(".shadow");
let url = "http://localhost:3000/category";
let tbody = document.querySelector("tbody");

const getList = () => {
  fetch(`${url}/getListCategory`,{
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
                <th class="border border-gray-300 px-4 py-2">Mã loại sản phẩm</th>
                <th class="border border-gray-300 px-4 py-2">Tên</th>
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
                <td class="border border-gray-300 px-4 py-2">
                   <img
                    alt="Product image"
                    class="w-12 h-12"
                    height="50"
                    src="${item.image}"
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
            fetch(`${url}/deleteproduct/${id}`, { method: "DELETE" ,
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
          fetch(`${url}/getcategoryById/${id}`,{
            method: "GET",
            headers: {
              "Authorization": "trinh_nhung",
               "Content-Type": "application/json"
          }
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
      /////
    });
};

///bang
function createProductDetailHTML(
  product = {}, // Accept an empty object for adding
  isReadonly = false,
  showSaveButton = false,
  title = ""
) {
  const {
    image = [],
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
        <img alt="User avatar" class="w-32 h-32 rounded-full" src="${image}" />
      </div>
      <div class="w-3/4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="id">ID</label>
            <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="id" type="text" value="${_id}" readonly />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700" for="avatar-link">Link avatar</label>
          <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" id="avatar-link" type="text" value="${image}" ${readonlyAttr} />
        </div>
        <div class="mt-4">
         ${saveButtonHTML}
          <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="restoreRow()">Quay lại</button>
        </div>
      </div>
    </div>
  `;
}
////back
function restoreRow() {
    getList();
}
/////
getList();
