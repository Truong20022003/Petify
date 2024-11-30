const content = document.querySelector(".shadow");
const url = "http://localhost:3000/invoice";
const headers = {
  Authorization: "trinh_nhung",
  "Content-Type": "application/json",
};

const getList = async () => {
  try {
    const response = await fetch(`${url}/getListInvoice`, {
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
  const namesuser = await Promise.all(
    data.map((item) => checkUser(item.user_id))
  );
  // console.log(namesuser, "namesuser");
  content.innerHTML = /*html*/ `
    <div class="flex mb-4">
      <button class="bg-[#396060] text-white px-4 py-2 rounded mr-2 btnadd">Thêm mới</button>
      <input class="border border-gray-300 rounded px-4 py-2 flex-grow" placeholder="Tìm kiếm" type="text" />
      <button class="bg-[#396060] text-white px-4 py-2 rounded ml-2">Tìm kiếm</button>
    </div>
    <table class="content w-full border-collapse">
      <thead>
        <tr class="bg-[#396060] text-white">
          <th class="border border-gray-300 px-4 py-2">STT</th>
          <th class="border border-gray-300 px-4 py-2">Tên nguòi dùng</th> <!-- user_id -->
          <th class="border border-gray-300 px-4 py-2">Tổng tiền</th><!-- total -->
          <th class="border border-gray-300 px-4 py-2">Ngày</th><!-- date -->
          <th class="border border-gray-300 px-4 py-2">Trạng thái</th><!-- status -->
          <th class="border border-gray-300 px-4 py-2">Địa chỉ</th><!-- delivery_address -->
          <th class="border border-gray-300 px-4 py-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (item, index) => /*html*/ `
              <tr id="row-${item._id}">
                <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
                <td class="border border-gray-300 px-4 py-2">
                    ${
                      namesuser[index] === ""
                        ? "User không tồn tại"
                        : namesuser[index]
                    }
                </td>
                <td class="border border-gray-300 px-4 py-2">${item.total}</td>
                <td class="border border-gray-300 px-4 py-2">${item.date}</td>
                <td class="border border-gray-300 px-4 py-2">${item.status}</td>
                <td class="border border-gray-300 px-4 py-2">${
                  item.delivery_address
                }</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="button-group flex flex-col space-y-2">
                    <!-- <button class="bg-blue-500 text-white px-2 py-1 rounded btnedit" data-id="${
                      item._id
                    }">Cập nhật</button> -->
                    <!-- <button class="bg-red-500 text-white px-2 py-1 rounded btndelete" data-id="${
                      item._id
                    }">Xóa</button> -->
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
  addEventListeners();
};

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
    const response = await fetch(`${url}/getinvoiceById/${id}`, {
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

// Lấy chi tiết hóa đơn (Invoice Detail)
const getInvoiceDetail = async (invoiceId) => {
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
    // console.log(invoiceId, "invoiceId");

    // console.log(data, "invoice_id");

    const details = data.filter((item) => item.invoice_id === invoiceId);
    // console.log(details, "details");

    // Nếu không có chi tiết hóa đơn, trả về chuỗi rỗng hoặc thông báo phù hợp
    if (details.length === 0) {
      console.log("No details found for this invoice");
      return "<tr><td colspan='3'>Không có chi tiết hóa đơn</td></tr>"; // Hoặc có thể hiển thị thông báo khác
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
    // console.log(data.result, "datauser");

    const name = data.result.name;
    // console.log(name, "name");

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
    // console.log(name, "name");

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
