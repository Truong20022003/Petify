const content = document.querySelector(".shadow");
const url = "http://localhost:3000";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getList = async () => {
  try {
    const response = await fetch(`${url}/order/getListOrder`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    renderTable(data);

  } catch (err) {
    console.log(err);
  }
};

const renderTable = async (data) => {
  // console.log(namesuser, "namesuser");
  content.innerHTML = /*html*/ `
    <div class="flex mb-4">
      <!-- <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button> -->
      <input class="border border-gray-300 rounded px-4 py-2 flex-grow" id="searchInput" placeholder="Tìm kiếm theo mã đơn hàng" type="text" />
      <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2" id="searchButton">Tìm kiếm</button>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-[#396060] text-white">
          <th class="border border-gray-300 px-4 py-2">STT</th>
          <th class="border border-gray-300 px-4 py-2">Tên nguòi dùng</th> <!-- user_id -->
          <th class="border border-gray-300 px-4 py-2">Mã hóa đơn</th>
          <th class="border border-gray-300 px-4 py-2">Tổng tiền</th><!-- total -->
          <th class="border border-gray-300 px-4 py-2">Ngày</th><!-- date -->
          <th class="border border-gray-300 px-4 py-2">Trạng thái</th><!-- status -->
          <th class="border border-gray-300 px-4 py-2">Địa chỉ</th><!-- delivery_address -->
          <th class="border border-gray-300 px-4 py-2">Hành động</th>
        </tr>
      </thead>
      <tbody id="roleList">
      </tbody>
    </table>`;
  document
    .getElementById("searchInput")
    .addEventListener("input", async (e) => {
      const query = e.target.value;
      const filtered = search(query, data);
      renderList(filtered);
    });
  renderList(data);

};


const renderList = async (data) => {
  const tableBody = document.getElementById("roleList");
  tableBody.innerHTML = "";
  console.log(data, "dataaaa");
  const namesuser = await Promise.all(
    data.map((item) => checkUser(item.user_id))
  );
  if (data.length === 0) {
    // Nếu không có người dùng nào trong kết quả tìm kiếm
    const noDataRow = /*html*/ `
      <tr>
        <td colspan="8" class="border border-gray-300 px-4 py-2 text-center text-red-500">
          Không có kết quả trùng khớp
        </td>
      </tr>`;
    tableBody.innerHTML = noDataRow;
  } else {
    data.forEach((item, index) => {

      const row = /*html*/ `
       <tr id="row-${item._id}">
                <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
                <td class="border border-gray-300 px-4 py-2">
                    ${namesuser[index] === ""
          ? "User không tồn tại"
          : namesuser[index]
        }
                </td>
                <td class="border border-gray-300 px-4 py-2">${item.code}</td>
                <td class="border border-gray-300 px-4 py-2">${item.total_price}</td>
                <td class="border border-gray-300 px-4 py-2">${item.oder_date}</td>
                <td class="border border-gray-300 px-4 py-2">${item.status}</td>
                <td class="border border-gray-300 px-4 py-2">${item.delivery_address
        }</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="button-group flex flex-col space-y-2">
                    <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${item._id
        }">Cập nhật</button>
                    <!-- <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${item._id
        }">Xóa</button> -->
                    <button class="bg-[#008080] text-white px-2 py-1 rounded btndetail" data-id="${item._id
        }">Chi tiết</button>
                  </div>
                </td>
              </tr>`;
      tableBody.innerHTML += row;
    });
  }
  addEventListeners();
};
// Hàm tìm kiếm người dùng
function search(query, data) {
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const queryNormalized = removeVietnameseTones(query.toLowerCase());

  // Lọc danh sách người dùng
  const filtered = data.filter((role) => {
    const userNameNormalized = removeVietnameseTones(role.code.toLowerCase());
    return userNameNormalized.includes(queryNormalized);
  });

  return filtered;
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
  const saveButtonHTML = showSaveButton
    ? `<button class="bg-green-500 text-white px-4 py-2 rounded save m-5" onclick="${_id ? `saveEdit('${_id}')` : "saveAdd()"
    }">Lưu</button>`
    : "";

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
              <select id="statusSelect"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                ${readonlyAttr}> 
                <option value="0" ${status === "Đang chờ xác nhận" ? "selected" : ""}>Đang chờ xác nhận</option>
                <option value="1" ${status === "Hủy đơn" ? "selected" : ""}>Hủy đơn</option>
                <option value="2" ${status === "Chờ giao hàng" ? "selected" : ""}>Chờ giao hàng</option>
                <option value="3" ${status === "Thành công" ? "selected" : ""}>Thành công</option>
              </select>
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
        ${saveButtonHTML}
          <button class="bg-blue-500 text-white px-4 py-2 rounded back" onclick="getList()">Quay lại</button>
      </div>
  `;
};

const saveEdit = async (_id) => {
  const statusSelect = document.getElementById("statusSelect");
  const selectedText = statusSelect.options[statusSelect.selectedIndex].text; // Lấy text của tùy chọn được chọn
  const selectedValue = statusSelect.value;
  console.log(selectedText, "selectedText,heehh");

  // Cập nhật trạng thái nếu nó là một trong các trạng thái yêu cầu
  if (selectedValue == 0 || selectedValue == 1 || selectedValue == 2) {
    const updateStatusResult = await upDateStatus(_id, selectedText);
    if (updateStatusResult) {
      dialogSuccess("Cập nhật trạng thái thành công.");
      getList();
    }
  } else {
    // Nếu trạng thái đã được cập nhật thành công và là "Thành công"
    const updateStatusResult = await upDateStatus(_id, selectedText);
    if (updateStatusResult) {
      // Kiểm tra lại trạng thái sau khi cập nhật
      const order = await fetchOrderById(_id);
      if (order.status === "Thành công") {
        // Gọi API process-order nếu trạng thái là "Thành công"
        try {
          const response = await fetch(`${url}/order/process-order/${_id}`, {
            method: "POST",
            headers: { Authorization: "trinh_nhung" },
          });
          const data = await response.json();
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

const upDateStatus = async (_id, selectedText) => {
  try {
    const response = await fetch(`${url}/order/updateorder/${_id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status: selectedText }),
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

        if (!product) {
          return `<tr><td colspan='3'>Không tìm thấy sản phẩm</td></tr>`;
        }

        return `
          <tr>
              <td class="border border-gray-300 px-4 py-2">
                   <img
                    alt="Product image"
                    class="w-12 h-12"
                    height="50"
                    src="${product.image[0]}"
                    width="100"
                  />
                </td>
              <td class="border border-gray-300 px-4 py-2">${product.name}</td>
              <td class="border border-gray-300 px-4 py-2">${detail.quantity}</td>
              <td class="border border-gray-300 px-4 py-2">${detail.total_price}</td>
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
    console.log(data, "datauser");

    const name = data.name;
    console.log(name, "name333");

    return name; // Trả về giá trị tên sau khi fetch thành công
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
