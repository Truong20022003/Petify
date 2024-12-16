const content = document.querySelector(".shadow");
const url = "http://localhost:3000/invoice";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};
let currentPage = 1;
let totalPages = 1;
let allData = [];  // Dữ liệu tổng hợp sau khi lấy từ API.
let filteredData = []; // Dữ liệu đã lọc từ tìm kiếm
const getList = async () => {
  try {
    const loadding = dialogLoading("Đang tải dữ liệu...")
    const response = await fetch(`${url}/getListInvoice`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    console.log(data);
    allData = data;  // Lưu dữ liệu tổng hợp
    filteredData = data;  // Mặc định ban đầu là toàn bộ dữ liệu
    totalPages = Math.ceil(allData.length / 10);  // Giả sử mỗi trang có 10 bản ghi
    renderTable(data);
    loadding.close()
  } catch (err) {
    console.log(err);
  }
};

const renderTable = async (data) => {
  content.innerHTML = /*html*/ `
    <div class="flex mb-4">
      <input class="border border-gray-300 rounded px-4 py-2 flex-grow" id="searchInput" placeholder="Tìm kiếm theo mã đơn hàng" type="text" />
      <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2" id="searchButton">Tìm kiếm</button>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-[#396060] text-white">
          <th class="border border-gray-300 px-4 py-2">STT</th>
          <th class="border border-gray-300 px-4 py-2">Tên người dùng</th>
          <th class="border border-gray-300 px-4 py-2">Mã hóa đơn</th>
          <th class="border border-gray-300 px-4 py-2">Tổng tiền</th>
          <th class="border border-gray-300 px-4 py-2">Ngày</th>
          <th class="border border-gray-300 px-4 py-2">Trạng thái</th>
          <th class="border border-gray-300 px-4 py-2">Địa chỉ</th>
          <th class="border border-gray-300 px-4 py-2">Hành động</th>
        </tr>
      </thead>
      <tbody id="roleList"></tbody>
    </table>
    <div class="pagination flex justify-between mt-4">
        <button id="prevPage" class="bg-[#008080] text-white px-4 py-2 rounded" disabled>Trang trước</button>
        <span id="pageInfo" class="text-gray-700">Trang ${currentPage} / ${totalPages}</span>
        <button id="nextPage" class="bg-[#008080] text-white px-4 py-2 rounded">Trang sau</button>
    </div>`;
  const datasuser = await Promise.all(
    data.map((item) => checkUser(item.user_id))
  );
  console.log(datasuser, "datasuser")
  // Xử lý tìm kiếm
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value;
    filteredData = search(query, allData);  // Lọc lại dữ liệu khi người dùng nhập tìm kiếm
    currentPage = 1;  // Reset về trang đầu khi tìm kiếm
    totalPages = Math.ceil(filteredData.length / 10);  // Tính lại số trang sau tìm kiếm
    renderList(filteredData, datasuser);  // Render lại dữ liệu sau tìm kiếm
  });

  // Xử lý chuyển trang
  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderList(filteredData, datasuser);  // Render lại dữ liệu sau khi chuyển trang
    }
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderList(filteredData, datasuser);  // Render lại dữ liệu khi quay lại trang trước
    }
  });

  renderList(data, datasuser);  // Render dữ liệu ban đầu
};
const formatInvoiceDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm '0' nếu cần
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (tháng bắt đầu từ 0, phải cộng thêm 1)
  const year = date.getFullYear(); // Lấy năm
  const hour = String(date.getHours()).padStart(2, '0'); // Lấy giờ, thêm '0' nếu cần
  const minute = String(date.getMinutes()).padStart(2, '0'); // Lấy phút, thêm '0' nếu cần
  const second = String(date.getSeconds()).padStart(2, '0'); // Lấy giây, thêm '0' nếu cần

  return `${day}-${month}-${year} ${hour}H-${minute}m`; // Định dạng theo kiểu dd-MM-yyyy HH-mm-ss
};
const renderList = async (data, namesuser) => {
  const tableBody = document.getElementById("roleList");
  tableBody.innerHTML = "";
  console.log(namesuser, "kkkkk")
  // Phân trang dữ liệu đã lọc
  const start = (currentPage - 1) * 10;
  const end = start + 10;
  const paginatedData = data.slice(start, end);

  if (paginatedData.length === 0) {
    const noDataRow = /*html*/ `
      <tr>
        <td colspan="8" class="border border-gray-300 px-4 py-2 text-center text-red-500">
          Không có kết quả trùng khớp
        </td>
      </tr>`;
    tableBody.innerHTML = noDataRow;
  } else {
    // Kết hợp tên người dùng với dữ liệu đơn hàng
    paginatedData.forEach((item, index) => {
      const totalAmount = Number(item.total) + Number(item.shipping_fee);
      const user = namesuser.find(user => user._id === item.user_id); // Tìm user tương ứng
      const row = /*html*/ `
        <tr id="row-${item._id}">
          <td class="border border-gray-300 px-4 py-2">${start + index + 1}</td>
          <td class="border border-gray-300 px-4 py-2"> ${user ? user.name : "User không tồn tại"}</td>
          <td class="border border-gray-300 px-4 py-2">${item.code}</td>
          <td class="border border-gray-300 px-4 py-2">${formatNumberWithComma(totalAmount)}</td>
          <td class="border border-gray-300 px-4 py-2">${formatInvoiceDate(new Date(item.date))}</td>
          <td class="border border-gray-300 px-4 py-2">${item.status}</td>
          <td class="border border-gray-300 px-4 py-2">${item.delivery_address}</td>
          <td class="border border-gray-300 px-4 py-2">
            <!-- <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${item._id}">Cập nhật</button> -->
            <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${item._id}">Chi tiết</button>
          </td>
        </tr>`;
      tableBody.innerHTML += row;
    });
  }

  updatePaginationButtons();
  addEventListeners();
};
const formatNumberWithComma = (number) => {
  return number.toLocaleString('vi-VN');
};


const updatePaginationButtons = () => {
  document.getElementById("pageInfo").textContent = `Trang ${currentPage} / ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
};

function search(query, data) {
  const removeVietnameseTones = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  return data.filter((role) => {
    const userNameNormalized = removeVietnameseTones(role.code.toLowerCase());
    return userNameNormalized.includes(queryNormalized);
  });
}

const addEventListeners = () => {
  console.log("Adding event listeners");
  document.querySelectorAll(".btndelete").forEach((btn) =>
    btn.addEventListener("click", () => {
      console.log("Delete button clicked", btn.dataset.id);
      handleDelete(btn.dataset.id);
    })
  );
  document.querySelectorAll(".btndetail").forEach((btn) =>
    btn.addEventListener("click", () => {
      console.log("Detail button clicked", btn.dataset.id);
      handleDetail(btn.dataset.id);
    })
  );
  document
    .querySelectorAll(".btnedit")
    .forEach((btn) =>
      btn.addEventListener("click", () => handleEdit(btn.dataset.id))
    );
  document
    .querySelector(".btnadd")
    ?.addEventListener("click", () =>
      renderDetailForm({}, false, true, "Thêm người dùng")
    );
};

const handleDelete = async (id) => {
  console.log("hihi");
  if (!confirm("Bạn có chắc muốn xóa không?")) return;
  try {
    await fetch(`${url}/deleteinvoice/${id}`, { method: "DELETE", headers });
    alert("Xóa thành công!");
    getList();
  } catch (err) {
    console.log(err);
  }
};
const handleEdit = async (id) => {
  try {
    const response = await fetch(`${url}/getinvoiceById/${id}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    const invoiceDetailHTML = await getInvoiceDetail(id);
    console.log(invoiceDetailHTML, "invoiceDetailHTML");
    renderDetailForm(
      data.result,
      true,
      false,
      "Chi tiết hóa đơn",
      invoiceDetailHTML
    );
  } catch (err) {
    console.log(err);
  }
};
const handleDetail = async (id) => {
  try {
    // Fetch thông tin hóa đơn chính
    const laoding = dialogLoading('Đang tải hóa đơn...')
    const response = await fetch(`${url}/getinvoiceById/${id}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    // Lấy chi tiết hóa đơn (Invoice Detail) của hóa đơn này
    const invoiceDetailHTML = await getInvoiceDetail(id);
    const userName = await checkUser(data.result.user_id);
    console.log(userName.name, "userName")
    const carrier = await getByIDCarrier(data.result.carrier_id);

    laoding.close()
    dialogInvoice(data.result, userName, invoiceDetailHTML, carrier.name)
    // renderDetailForm(
    //   data.result,
    //   true,
    //   false,
    //   "Chi tiết hóa đơn",
    //   invoiceDetailHTML
    // );
  } catch (err) {
    console.log(err);
  }
};

// Lấy chi tiết hóa đơn (Invoice Detail)
const getInvoiceDetail = async (invoiceid) => {
  try {
    const response = await fetch(
      `http://localhost:3000/invoiceDetail/getListInvoiceDetail`,
      {
        method: "GET",
        headers,
      }
    );
    const data = await response.json();
    // console.log(data);
    // console.log(invoiceid, "order_id");

    // console.log(data, "invoice_id");

    const details = data.filter((item) => item.invoice_id === invoiceid);
    // console.log(details, "details");

    // Nếu không có chi tiết hóa đơn, trả về chuỗi rỗng hoặc thông báo phù hợp
    if (details.length === 0) {
      console.log("No details found for this invoice");
      return "<tr><td colspan='3'>Không có chi tiết Đơn hàng</td></tr>"; // Hoặc có thể hiển thị thông báo khác
    }

    const detailsHTML = await Promise.all(
      details.map(async (detail) => {
        const product = await getByIdProduct(detail.product_id);
        console.log(product, "hihih")
        const discountedPrice = product.price - (product.price * product.sale) / 100;
        if (!product) {
          return `<tr><td colspan='3'>Không tìm thấy sản phẩm</td></tr>`;
        }

        return /*html*/`
          <tr>
              <td class="border border-gray-300 px-4 py-2 text-center">
                   <img
                    alt="Product image"
                    class="w-12 h-12"
                    height="50"
                    src="${product.image[0]}"
                    width="100"
                    crossOrigin="anonymous"
                  />
                </td>
              <td class="border border-gray-300 px-4 py-2 text-center">${product.name}</td>
             <td class="border border-gray-300 px-4 py-2 text-center">${detail.quantity}</td> 
             <td class="border border-gray-300 px-4 py-2 text-center">${discountedPrice.toLocaleString('vi-VN')}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">${detail.total_price.toLocaleString('vi-VN')}</td>
          </tr>
        `;
      })
    );
    return detailsHTML.join("");
  } catch (err) {
    console.log(err);
    return "<tr><td colspan='3'>Đã xảy ra lỗi khi lấy chi tiết hóa đơn.</td></tr>";
  }
};
const getByIdProduct = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/product/getproductById/${id}`,
      {
        method: "GET",
        headers,
      }
    );
    const data = await response.json();
    return {
      name: data.result.name,
      image: data.result.image,
      price: data.result.price,
      sale: data.result.sale
    }
  } catch (err) {
    console.log(err);
    return "";
  }
};

const renderDetailForm = async (
  invoice = {},
  isReadonly = false,
  showSaveButton = false,
  title = "",
  invoiceDetailHTML = ""
) => {
  const {
    _id = "",
    user_id = "",
    total = "",
    date = "",
    status = "",
    payment_method = "",
    delivery_address = "",
    shipping_fee = "",
    carrier_id = "",
  } = invoice;

  const readonlyAttr = isReadonly ? "readonly" : "";
  const userName = await checkUser(user_id);
  console.log(invoiceDetailHTML, "rr");
  const carrier = await getByIDCarrier(carrier_id);

  content.innerHTML = /*html*/ `
      <h2 class="text-xl font-bold mb-4">${title}</h2>
      <div class="grid grid-cols-2 gap-4">
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Tên người dùng</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${userName}" ${readonlyAttr} />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${payment_method}" ${readonlyAttr} />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${delivery_address}" ${readonlyAttr} />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${status}" ${readonlyAttr} />
          </div>
          <div class=""><label class="block text-sm font-medium text-gray-700">Phí vận chuyển</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${shipping_fee}" ${readonlyAttr} />
          </div>
          <div class=""><label class="block text-sm font-medium text-gray-700">Đơn vị vận chuyển</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${carrier.name}" ${readonlyAttr} />
          </div>
      </div>
     
      <h3 class="text-lg font-semibold mt-4">Chi tiết sản phẩm</h3>
      <table class="w-full mt-4">
          <thead>
              <tr class="bg-[#396060] text-white">
                  <th class="border border-gray-300 px-4 py-2">Ảnh sản phẩm</th>
                  <th class="border border-gray-300 px-4 py-2">Sản phẩm</th>
                  <th class="border border-gray-300 px-4 py-2">Số lượng</th>
                  <th class="border border-gray-300 px-4 py-2">Tổng giá</th>
              </tr>
          </thead>
          <tbody>
              ${invoiceDetailHTML}
          </tbody>
      </table>
       <div class="mt-4">
          <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
      </div>
  `;
};

const saveEditUser = async (_id) => {
  const updatedRole = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
  };
  try {
    const response = await fetch(`${url}/updateinvoice/${_id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedRole),
    });
    const data = await response.json();
    alert(
      data.status
        ? "Cập nhật role thành công!"
        : "Cập nhật thất bại. Vui lòng thử lại."
    );
    getList();
  } catch (error) {
    console.error("Lỗi khi cập nhật role:", error);
    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
};

const saveAddUser = async () => {
  const newRole = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
  };
  try {
    const response = await fetch(`${url}/addinvoice`, {
      method: "POST",
      headers,
      body: JSON.stringify(newRole),
    });
    const data = await response.json();
    alert(
      data.status ? "Thêm  thành công!" : "Thêm thất bại. Vui lòng thử lại."
    );
    getList();
  } catch (error) {
    console.error("Lỗi khi thêm ", error);
    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  }
};
async function getByIDCarrier(id) {
  //   console.log(id, "checkuser");
  try {
    const response = await fetch(
      `http://localhost:3000/carrier/getCarrierById/${id}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    // console.log(data.result, "datauser");
    return {
      name: data.result.name,
      image: data.result.phone,
    };
  } catch (err) {
    console.log(err);
    return "";
  }
}
async function checkUser(id) {
  //   console.log(id, "checkuser");
  try {
    const response = await fetch(
      `http://localhost:3000/user/getuserById/${id}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    console.log(data, "datauser");

    // const name = data.name;
    // console.log(name, "name333");

    return data; // Trả về giá trị tên sau khi fetch thành công
  } catch (err) {
    console.log(err);
    return ""; // Trả về chuỗi rỗng nếu có lỗi
  }
}
async function checkListInvoiceDetail(id) {
  //   console.log(id, "checkuser");
  try {
    const response = await fetch(
      `http://localhost:3000/invoiceDetail/getListInvoiceDetail`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    console.log(data.result, "InvoiceDetail");

    const name = data.result.name;
    console.log(name, "name");

    return name; // Trả về giá trị tên sau khi fetch thành công
  } catch (err) {
    console.log(err);
    return ""; // Trả về chuỗi rỗng nếu có lỗi
  }
}

getList();
