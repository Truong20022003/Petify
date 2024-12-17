let currentImages = [];
const renderForm = (
  {
    _id = "",
    image = [],
    supplier_id = "",
    price = "",
    date = "",
    expiry_Date = "",
    quantity = "",
    status = "",
    name = "",
    description = "",
    sale = "",
    image_id = []
  },
  isReadonly = false,
  showSaveButton = false,
  title,
  suppliers,
  category,
  categorylist
) => {
  let selectedSupplierId = '';
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save" onclick="${_id ? `saveEdit('${_id}', event,'${image_id}')` : "saveAdd(event)"
    }">Lưu</button>`
    : "";

  const readonlyAttr = isReadonly ? "readonly" : "";
  // console.log(category, "category")
  function isCategoryChecked(categoryid) {
    return Array.isArray(category) && category.some(item => item.category_id === categoryid);
  }

  currentImages = image.map(imgSrc => ({ file: null, url: imgSrc }));

  // Render ảnh từ `currentImages`
  const imageHTML = currentImages
    .map(
      (img) => /*html*/ `
      <div class="relative w-32 h-32 m-2 inline-block" data-src="${img.url}">
        <img alt="Product Image" class="w-full h-full object-cover rounded-md" src="${img.url}" />
        <button class="remove-btn" onclick="removeImage('${img.url}')">X</button>
      </div>
    `
    )
    .join("");
  const categoryCheckboxes = categorylist
    .map((item, index) => /*html*/ `
      <label class="category-item">
      <input type="checkbox" name="option" value="${item._id}" ${isCategoryChecked(item._id) ? "checked" : ""}>
      ${item.name}
    </label>
    `)
    .join("");


  content.innerHTML =/*html*/ `
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
          .grid-container {
          display: grid;                /* Kích hoạt chế độ Grid */
          grid-template-columns: repeat(2, 1fr); /* Chia 2 cột */
          gap: 16px;                    /* Khoảng cách giữa các mục */
          width: 100%;                  /* Đảm bảo toàn bộ chiều rộng khung */
          padding: 8px;                 /* Thêm padding bên trong nếu cần */
        }
  
        .category-item {
          display: flex;
          align-items: center;          /* Canh giữa checkbox và text */
          gap: 8px;                     /* Khoảng cách giữa checkbox và text */
          font-size: 14px;              /* Kích thước chữ */
        }
      </style>
      <h2 class="text-xl font-bold mb-4">${title}</h2>
      <form> 
            <div class="container mx-auto flex justify-between gap-4">
          <!-- Phần chọn ảnh -->
          <div class="w-1/2">
            <input type="file" id="file-input" multiple accept="image/*" accept=".jpg,.jpeg,.png"class="mb-4" />
            <div id="image-container" class="flex flex-wrap gap-4 overflow-y-scroll h-64 w-full border border-gray-300 p-2">
            ${imageHTML}
            </div>
          </div>
          <!-- Phần loại sản phẩm -->
          <div class="w-1/2">
            <h1 class="block text-sm font-medium text-gray-700">
              Loại sản phẩm
            </h1>
            <div id="category-container" class="grid-container">
               ${categoryCheckboxes}
              </div>
          </div>
        </div>
  
      <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700" for="product-code">
                Tên sản phẩm
              </label>
              <textarea
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="name"
                rows="9"
                >${name}</textarea>
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-700" for="description">
              Mô tả
            </label>
            <textarea
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="description"
              placeholder="Mô tả của bạn ....."
              rows="9"
            >${description}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700" for="product-price">
                Giá sản phẩm
              </label>
              <input
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="price"
                type="number"
                min="0"
                value="${price}"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"  >
                Nhà phân phối
              </label>
              <select
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="supplier"
              >
                <option value="">Chọn nhà phân phối</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700" for="start-date">
                Ngày bắt đầu
              </label>
              <input
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="start-date"
                type="date"
                value="${convertDateFormat(date)}"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700" for="end-date">
                Ngày kết thúc
              </label>
              <input
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="end-date"
                type="date"
                value="${convertDateFormat(expiry_Date)}"
              />
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-700" for="status">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Còn hàng" ${status === "Còn hàng" ? 'selected' : ''}>Còn hàng</option>
              <option value="Hết hàng" ${status === "Hết hàng" ? 'selected' : ''}>Hết hàng</option>
            </select>
          </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"  >
                Số lượng
              </label>
              <input
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="quantity"
                type="text"
                value="${quantity}"
              />
            </div>
          </div>
          <div class="mb-6">
           
          </div>
        <div class="mt-4">
           ${saveButtonHTML}
            <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
          </div>
      </form>
    `



  const supplierSelect = document.getElementById("supplier");

  // Điền các option vào `select`
  suppliers.forEach(supplier => {
    const option = document.createElement("option");
    option.value = supplier._id; // Gán `value` là ID nhà phân phối
    option.textContent = supplier.name; // Hiển thị tên nhà phân phối
    supplierSelect.appendChild(option);
  });

  // Nếu có supplier_id, thiết lập giá trị mặc định
  if (supplier_id) {
    supplierSelect.value = supplier_id;
  }

  supplierSelect.addEventListener("change", (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    selectedSupplierId = selectedOption.value;
    const name = selectedOption.textContent;

    console.log("ID Nhà phân phối:", selectedSupplierId);
    console.log("Tên Nhà phân phối:", name);
  });

}
const renderDetailHtml = (dataproduct) => {
  content.innerHTML = /*html*/`    
   <h2 class="text-xl font-bold mb-4 items-center">Chi tiết sản phẩm</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 m-5">
  <!-- cuc1 -->
  <div class="space-y-4">
    <div class="flex items-center mb-2 m-5">
    <span class="text-2xl font-semibold">Tên sản phẩm: ${dataproduct.name}</span>
    </div>
    <div class="flex flex-wrap gap-2 px-2 ">
    ${dataproduct.image
      .map(
        (img) => /*html*/ `
        <div
            class="w-[100px] h-[100px] flex-shrink-0 border border-gray-300 rounded-lg overflow-hidden hover:shadow-md hover:border-gray-400 transition"
        >
            <img
            alt="Product image"
            class="w-full h-full object-cover"
            src="${img}"
            />
        </div>
        `
      )
      .join("")}
    </div>
    <div class="space-y-4 m-5">
        <div class="mb-2">
        <strong class="text-lg">Giá sản phẩm:</strong>
        <span class="text-gray-600">${dataproduct.price}</span>
        </div>
        <div class="mb-2">
        <strong class="text-lg">Ngày nhập:</strong>
        <span class="text-gray-600">${dataproduct.date}</span>
        </div>
        <div class="mb-2">
        <strong class="text-lg">Trạng thái:</strong>
        <span class="text-gray-600">${dataproduct.status}</span>
        </div>
        <div class="mb-2">
        <strong class="text-lg">Ngày hết hạn:</strong>
        <span class="text-gray-600">${dataproduct.expiry_Date}</span>
        </div>
        <div class="mb-2">
        <strong class="text-lg">Số lượng sản phẩm:</strong>
        <span class="text-gray-600">${dataproduct.quantity}</span>
        </div>
    </div>
  </div>

<!-- cuc2 -->
<div class="">
  <strong class="text-lg">Mô tả:</strong>
  <p class="text-gray-700">
    ${dataproduct.description.replace(/\n/g, "<br />")}
  </p>
</div>
</div>
  </div>
<button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
  `
}



exports = { renderForm, renderDetailHtml }