const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

let currentPage = 1;
let totalPages = 1;
let allData = [];  // Dữ liệu tổng hợp sau khi lấy từ API.
let filteredData = []; // Dữ liệu đã lọc từ tìm kiếm
const urlParams = new URLSearchParams(window.location.search);
let orderCode = urlParams.get("orderCode");

// console.log(orderCode, "dddddddddddddddddddddddddddddddddddd")
const getList = async () => {
  try {
    const response = await fetch(`${url}/order/getListOrder`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    allData = data;  // Lưu dữ liệu tổng hợp
    filteredData = data;  // Mặc định ban đầu là toàn bộ dữ liệu
    totalPages = Math.ceil(allData.length / 25);  // Giả sử mỗi trang có 10 bản gh
    if (orderCode && orderCode.startsWith("#")) {
      orderCode = orderCode.slice(1);
    }
    if (orderCode) {
      filteredData = search(orderCode, allData); // Tìm kiếm theo mã đơn hàng
      currentPage = 1; // Đặt lại trang đầu tiên
      totalPages = Math.ceil(filteredData.length / 25); // Tính lại số trang
    }
    renderTable(filteredData);
  } catch (err) {
    console.log(err);
  }
};

const renderTable = async (data) => {
  content.innerHTML = /*html*/ `
    <div class="flex mb-4">
      <select id="statusFilter" class="border border-gray-300 rounded px-4 py-2 flex-grow">
        <option value="">Tất cả</option>
        <option value="Đang chờ xác nhận">Đang chờ xác nhận</option>
        <option value="Hủy đơn">Hủy đơn</option>
        <option value="Chờ giao hàng">Chờ giao hàng</option>
      </select>
      <input class="border border-gray-300 rounded px-4 py-2 flex-grow" id="searchInput" placeholder="Tìm kiếm theo mã đơn hàng" type="text" />
      <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2" id="searchButton">Tìm kiếm</button>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-[#396060] text-white">
          <th class="border border-gray-300 px-4 py-2">STT</th>
          <th class="border border-gray-300 px-4 py-2">Tên người dùng</th>
          <th class="border border-gray-300 px-4 py-2">Mã hóa đơn</th>
          <th class="border border-gray-300 px-4 py-2">Tổng tiền hàng(đ)</th>
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
  if (orderCode) {
    document.getElementById("searchInput").value = orderCode;  // Hiển thị mã đơn hàng lên thanh tìm kiếm
  }

  // Xử lý lọc theo trạng thái
  document.getElementById("statusFilter").addEventListener("change", (e) => {
    const statusFilterValue = e.target.value;
    filteredData = statusFilterValue
      ? allData.filter(order => order.status === statusFilterValue)  // Lọc theo trạng thái
      : allData;  // Nếu không chọn trạng thái, hiển thị tất cả dữ liệu
    currentPage = 1;  // Đặt lại trang đầu tiên khi lọc theo trạng thái
    totalPages = Math.ceil(filteredData.length / 25);  // Tính lại số trang sau khi lọc
    renderList(filteredData, datasuser);  // Render lại dữ liệu sau khi lọc theo trạng thái
  });

  // Xử lý tìm kiếm (chỉ tìm trong filteredData)
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value;

    if (query === "") {
      // Nếu xóa hết mã tìm kiếm, khôi phục lại dữ liệu gốc và cập nhật lại URL
      filteredData = allData;  // Khôi phục lại toàn bộ dữ liệu
      totalPages = Math.ceil(filteredData.length / 25);  // Tính lại số trang
      currentPage = 1;  // Reset về trang đầu tiên

      // Cập nhật lại URL để không có tham số orderCode
      const urlWithoutOrderCode = new URL(window.location.href);
      urlWithoutOrderCode.searchParams.delete("orderCode");
      window.history.replaceState({}, "", urlWithoutOrderCode);

    } else {
      // Tìm kiếm theo mã đơn hàng
      filteredData = search(query, filteredData);  // Tìm kiếm chỉ trong filteredData đã lọc theo trạng thái
      totalPages = Math.ceil(filteredData.length / 25);  // Tính lại số trang sau tìm kiếm
      currentPage = 1;  // Reset về trang đầu khi tìm kiếm
    }

    renderList(filteredData, datasuser);  // Render lại dữ liệu sau tìm kiếm hoặc khôi phục
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

  renderList(filteredData, datasuser);  // Render dữ liệu ban đầu (đã lọc trạng thái)
};



const renderList = async (data, namesuser) => {
  const tableBody = document.getElementById("roleList");
  tableBody.innerHTML = "";

  // Phân trang dữ liệu đã lọc
  const start = (currentPage - 1) * 25;
  const end = start + 25;
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
      const user = namesuser.find(user => user._id === item.user_id); // Tìm user tương ứng
      let statusClass = '';
      switch (item.status) {
        case "Đang chờ xác nhận":
          statusClass = 'bg-yellow-100';  // Màu vàng cho trạng thái này
          break;
        case "Hủy đơn":
          statusClass = 'bg-red-100';  // Màu đỏ cho trạng thái hủy
          break;
        case "Chờ giao hàng":
          statusClass = 'bg-blue-100';  // Màu xanh cho trạng thái chờ giao
          break;
        case "Thành công":
          statusClass = 'bg-green-100';  // Màu xanh lá cho trạng thái thành công
          break;
        default:
          statusClass = 'bg-white';  // Mặc định
          break;
      }
      const row = /*html*/ `
        <tr id="row-${item._id}">
          <td class="border border-gray-300 px-4 py-2">${start + index + 1}</td>
          <td class="border border-gray-300 px-4 py-2">${user ? user.name : "User không tồn tại"}</td>
          <td class="border border-gray-300 px-4 py-2">${item.code}</td>
          <td class="border border-gray-300 px-4 py-2">${item.total_price.toLocaleString('vi-VN')}đ</td>
          <td class="border border-gray-300 px-4 py-2">${formatDate(item.oder_date)}</td>
          <td class="border border-gray-300 px-4 py-2 ${statusClass}">${item.status}</td>
          <td class="border border-gray-300 px-4 py-2">${item.delivery_address}</td>
          <td class="border border-gray-300 px-4 py-2">
            <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${item._id}">Cập nhật</button>
            <!-- <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${item._id}">Chi tiết</button> -->
          </td>
        </tr>`;
      tableBody.innerHTML += row;
    });
  }

  updatePaginationButtons();
  addEventListeners();
};


const updatePaginationButtons = () => {
  document.getElementById("pageInfo").textContent = `Trang ${currentPage} / ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
};

function search(query, data) {
  const removeVietnameseTones = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  return data.filter((order) => {
    const codeNormalized = removeVietnameseTones(order.code.toLowerCase());
    return codeNormalized.includes(queryNormalized);
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
    const response = await fetch(`${url}/order/getorderById/${id}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    const invoiceDetailHTML = await getInvoiceDetail(id);
    console.log(invoiceDetailHTML, "invoiceDetailHTML");
    renderDetailForm(
      data.result,
      false, true,
      "Chi tiết đơn hàng",
      invoiceDetailHTML
    );
  } catch (err) {
    console.log(err);
  }
};
const handleDetail = async (id) => {
  try {
    // Fetch thông tin hóa đơn chính
    const response = await fetch(`${url}/order/getorderById/${id}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    // Lấy chi tiết hóa đơn (Invoice Detail) của hóa đơn này
    const invoiceDetailHTML = await getInvoiceDetail(id);
    const userName = await checkUser(data.result.user_id);
    console.log(userName.name, "userName")
    const carrier = await getByIDCarrier(data.result.carrier_id);
    dialogOder(data.result, userName, invoiceDetailHTML, carrier.name)
    // renderDetailForm(
    //   ,
    //   true,
    //   false,
    //   "Chi tiết hóa đơn",
    //   invoiceDetailHTML
    // );
  } catch (err) {
    console.log(err);
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
    total_price = "",
    oder_date = "",
    status = "",
    payment_method = "",
    delivery_address = "",
    shipping_fee = "",
    code = "",
    carrier_id = "",
  } = invoice;

  const readonlyAttr = isReadonly ? "readonly" : "";
  const userName = await checkUser(user_id);
  const carrier = await getByIDCarrier(carrier_id);
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save m-5" onclick="${_id ? `saveEdit('${_id}','${code}','${user_id}')` : "saveAdd()"}">Lưu</button>`
    : "";

  // Kiểm tra trạng thái hủy và vô hiệu hóa select
  const isDisabled = status === "Hủy đơn" ? "disabled" : "";
  // // Kiểm tra trạng thái đơn hàng và vô hiệu hóa các tùy chọn tương ứng ko cho chọn 
  // const isStep2OrHigher = status === "Chờ giao hàng" || status === "Thành công";
  // const disableStep1 = isStep2OrHigher ? "disabled" : "";  // Nếu đã qua bước 2, không thể chọn "Đang chờ xác nhận"
  // const disableStep2 = status === "Chờ giao hàng" ? "disabled" : ""; // Nếu đang ở "Chờ giao hàng", không thể chọn lại "Đang chờ xác nhận"

  // Kiểm tra trạng thái đơn hàng và xác định các lựa chọn cần ẩn
  const isStep2OrHigher = status === "Chờ giao hàng" || status === "Thành công";
  const hideStep1 = isStep2OrHigher ? "hidden" : "";  // Ẩn "Đang chờ xác nhận" nếu trạng thái là "Chờ giao hàng" hoặc "Thành công"
  const hideStep2 = status === "Chờ giao hàng" ? "hidden" : ""; // Ẩn "Chờ giao hàng" nếu trạng thái đang là "Chờ giao hàng"
  const hideStep3 = status === "Hủy đơn" ? "hidden" : ""; // Ẩn "Hủy đơn" nếu trạng thái là "Hủy đơn"

  content.innerHTML = /*html*/ `
      <h2 class="text-xl font-bold mb-4">${title}</h2>
      <div class="grid grid-cols-2 gap-4">
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Tên người dùng</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${userName.name}"readonly />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${code}" readonly />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Tổng tiền hàng (đ)</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${total_price.toLocaleString('vi-VN')}" readonly />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Ngày đặt hàng</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${formatDate(oder_date)}" readonly />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${delivery_address}" readonly />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${payment_method}" readonly />
          </div>
          <div class="">
              <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select id="statusSelect"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 " 
                ${readonlyAttr} ${isDisabled}>
                <!-- Trạng thái "Đang chờ xác nhận" -->
                <option value="0" ${status === "Đang chờ xác nhận" ? "selected" : ""} class="${hideStep1}">Đang chờ xác nhận</option>

                  <!-- Trạng thái "Hủy đơn" -->
                  <option value="1" ${status === "Hủy đơn" ? "selected" : ""} class="${hideStep3}">Hủy đơn</option>

                  <!-- Trạng thái "Chờ giao hàng" -->
                  <option value="2" ${status === "Chờ giao hàng" ? "selected" : ""} class="${hideStep2}">Chờ giao hàng</option>

                  <!-- Trạng thái "Thành công" -->
                  <option value="3" ${status === "Thành công" ? "selected" : ""}>Thành công</option>
              </select>
          </div>
          <div class=""><label class="block text-sm font-medium text-gray-700">Phí vận chuyển (đ)</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${Number(shipping_fee).toLocaleString('vi-VN')}" readonly />
          </div>
          <div class=""><label class="block text-sm font-medium text-gray-700">Đơn vị vận chuyển</label>
              <input class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${carrier === "" ? "Giao hàng nhanh" : carrier.name}" readonly />
          </div>
      </div>

      <h3 class="text-lg font-semibold mt-4">Chi tiết sản phẩm</h3>
      <table class="w-full mt-4">
          <thead>
              <tr class="bg-[#396060] text-white">
                  <th class="border border-gray-300 px-4 py-2">Ảnh sản phẩm</th>
                  <th class="border border-gray-300 px-4 py-2">Sản phẩm</th>
                  <th class="border border-gray-300 px-4 py-2">Số lượng</th> 
                  <th class="border border-gray-300 px-4 py-2">Đơn giá</th>
                  <th class="border border-gray-300 px-4 py-2">Thành tiền</th>
              </tr>
          </thead>
          <tbody>
              ${invoiceDetailHTML}
          </tbody>
      </table>
      <div class="mt-4">
        ${saveButtonHTML}
        <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
      </div>
  `;
};
const formatDate = (dateString) => {
  const parts = dateString.split(' '); // Tách ngày và giờ

  const dateParts = parts[0].split('-'); // Tách ngày (dd-MM-yyyy)
  const timeParts = parts[1].split(':'); // Tách giờ, phút, giây (hh:mm:ss)

  // Định dạng ngày và giờ
  const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
  const formattedTime = `H:${timeParts[0]} m:${timeParts[1]} ${parts[2]}`; // Chèn AM/PM

  return `${formattedDate} ${formattedTime}`;
};

const saveEdit = async (_id, code, user_id) => {
  console.log(code, "edit")
  const statusSelect = document.getElementById("statusSelect");
  const selectedText = statusSelect.options[statusSelect.selectedIndex].text; // Lấy text của tùy chọn được chọn
  const selectedValue = statusSelect.value;
  console.log(selectedText, "selectedText,heehh");

  // Cập nhật trạng thái nếu nó là một trong các trạng thái yêu cầu
  if (selectedValue == 0 || selectedValue == 1 || selectedValue == 2) {
    const updateStatusResult = await upDateStatus(_id, selectedText, code, user_id);
    if (updateStatusResult) {
      dialogSuccess("Cập nhật trạng thái thành công.");
      getList();
    }
  } else {
    // Nếu trạng thái đã được cập nhật thành công và là "Thành công"
    const updateStatusResult = await upDateStatus(_id, selectedText, code, user_id);
    if (updateStatusResult) {
      // Kiểm tra lại trạng thái sau khi cập nhật
      const order = await fetchOrderById(_id);
      if (order.status === "Thành công") {
        // Gọi API process-order nếu trạng thái là "Thành công"
        try {
          const loadding = dialogLoading("Dữ liệu đang được cập nhật...")
          const response = await fetch(`${url}/order/process-order/${_id}`, {
            method: "POST",
            headers: { Authorization: "trinh_nhung" },
          });
          const data = await response.json();
          loadding.close()
          dialogSuccess(data.message);
          getList();
          console.log(data.invoice, "Hoa đơn thành công");
          console.log(data.invoice_details, "Chi tiết hóa đơn thành công");
        } catch (error) {
          console.error("Lỗi khi xử lý đơn hàng:", error);
          dialogError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      } else {
        dialogError("Đơn hàng chưa ở trạng thái thành công, không thể xử lý.");
      }
    }
  }
};

const upDateStatus = async (_id, selectedText, code, userId) => {
  console.log(code, "sss")
  console.log(userId, "userId")

  try {
    const response = await fetch(`${url}/order/updateorder/${_id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status: selectedText, code: code, user_id: userId }),
    });
    const data = await response.json();
    if (data.status === "Update successfully") {
      return true;  // Trả về true khi cập nhật thành công
    } else {
      dialogError("Cập nhật trạng thái thất bại.");
      return false;
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    dialogError("Đã xảy ra lỗi khi cập nhật trạng thái.");
    return false;
  }
};

const fetchOrderById = async (_id) => {
  try {
    const response = await fetch(`${url}/order/getorderById/${_id}`, { headers });
    const data = await response.json();
    console.log(data.result, "data.resultlll")
    return data.result; // Trả về thông tin đơn hàng
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    return null;
  }
};
// Lấy chi tiết hóa đơn (Invoice Detail)
const getInvoiceDetail = async (orderid) => {
  try {
    const response = await fetch(
      `http://localhost:3000/order_detail/getListorderDetail`,
      {
        method: "GET",
        headers,
      }
    );
    const data = await response.json();
    // console.log(data);
    console.log(orderid, "order_id");

    // console.log(data, "invoice_id");

    const details = data.filter((item) => item.order_id === orderid);
    console.log(details, "details");

    // Nếu không có chi tiết hóa đơn, trả về chuỗi rỗng hoặc thông báo phù hợp
    if (details.length === 0) {
      console.log("No details found for this invoice");
      return "<tr><td colspan='3'>Không có chi tiết Đơn hàng</td></tr>"; // Hoặc có thể hiển thị thông báo khác
    }

    const detailsHTML = await Promise.all(
      details.map(async (detail) => {
        const product = await getByIdProduct(detail.product_id);
        const discountedPrice = product.price - (product.price * product.sale) / 100;
        if (!product) {
          return `<tr><td colspan='3'>Không tìm thấy sản phẩm</td></tr>`;
        }

        return /*html*/`
          <tr>
              <td class="border border-gray-300 px-4 py-2 w-[100] text-center">
                   <img
                    alt="Product image"
                    class="w-12 h-12"
                    height="50"
                    src="${product.image[0]}"
                    width="100"
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
    console.log(id, "iddddd")
    const response = await fetch(
      `http://localhost:3000/product/getproductById/${id}`,
      {
        method: "GET",
        headers,
      }
    );
    const data = await response.json();
    console.log(data.result, "ciuuuuuuuuuuuuuuu")
    return {
      name: data.result.name,
      image: data.result.image,
      price: data.result.price,
      sale: data.result.sale
    };
  } catch (err) {
    console.log(err);
    return "";
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
    // console.log(data, "datauser");

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
async function checkProduct(id) {
  //   console.log(id, "checkuser");
  try {
    const response = await fetch(
      `http://localhost:3000/product/getListProduct`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    console.log(data.result, "checkProduct");

    const name = data.result.name;
    // console.log(name, "name");

    return data.result; // Trả về giá trị tên sau khi fetch thành công
  } catch (err) {
    console.log(err);
    return ""; // Trả về chuỗi rỗng nếu có lỗi
  }
}

getList();
