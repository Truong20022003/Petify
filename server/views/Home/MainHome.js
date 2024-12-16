const headers = {
    Authorization: "trinh_nhung",
    "Content-Type": "application/json",
};
const today = dayjs();
let startDate = today.startOf("day");
let endDate = today.endOf("day");;

// Trạng thái phân trang cho từng bảng
const paginationState = {
    tbody_oder: 1, // Trang hiện tại của bảng đơn hàng
    tbody_user: 1, // Trang hiện tại của bảng người dùng
    tbody_product: 1, // Trang hiện tại của bảng sản phẩm
};

const itemsPerPage = 5; // Số mục trên mỗi trang

// Gắn sự kiện cho combobox
function selectOption(selectElement) {
    const selectedValue = selectElement.value;
    calculateTimeRange(selectedValue); // Tính toán thời gian bắt đầu và kết thúc

    // Reset trạng thái phân trang về trang đầu tiên
    Object.keys(paginationState).forEach((key) => {
        paginationState[key] = 1;
    });

    loadData(); // Gọi lại API với thời gian mới
}

// Hàm tính toán thời gian bắt đầu và kết thúc
function calculateTimeRange(filter) {
    const today = dayjs();

    if (filter === "today") {
        startDate = today.startOf("day");
        endDate = today.endOf("day");
    } else if (filter === "thisMonth") {
        startDate = today.startOf("month");
        endDate = today.endOf("month");
    } else if (filter === "thisYear") {
        startDate = today.startOf("year");
        endDate = today.endOf("year");
    }
}

const loadData = async () => {
    try {
        await Promise.all([getNewUser(), getAllUserOrders(), getNewProduct()]);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
};

const fetchData = async (url) => {
    try {
        const loadding = dialogLoading("Đang tải dữ liệu...")
        const response = await fetch(url, { headers });
        if (response.ok) {
            loadding.close()
        }
        return await response.json();
        lo
    } catch (error) {
        console.error(`Lỗi khi gọi API: ${url}`, error);
        throw error;
    }
};

// Hàm hiển thị phân trang
const renderPaginatedTable = (elementId, data, emptyMessage, rowRenderer) => {
    const table = document.getElementById(elementId);

    if (!data || data.length === 0) {
        table.innerHTML = /*html*/`
            <tr>
                <td class="h-full text-center" colspan="100%">
                    <div class="flex justify-center items-center h-full">
                        <h1 class="text-2xl font-bold text-gray-700">${emptyMessage}</h1>
                    </div>
                </td>
            </tr>`;
        // Ẩn container phân trang
        const paginationContainer = document.getElementById(`${elementId}-pagination`);
        if (paginationContainer) paginationContainer.style.display = "none";
        return;
    }

    // Lấy trạng thái trang hiện tại của bảng
    const currentPage = paginationState[elementId] || 1;

    // Tính toán số trang
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    // Hiển thị các mục của trang hiện tại
    table.innerHTML = paginatedData.map(rowRenderer).join("");

    // Hiển thị hoặc ẩn container phân trang
    const paginationContainer = document.getElementById(`${elementId}-pagination`);
    if (paginationContainer) {
        if (data.length <= itemsPerPage) {
            paginationContainer.style.display = "none"; // Ẩn nếu không cần phân trang
        } else {
            paginationContainer.style.display = "flex"; // Hiển thị nếu cần phân trang
            paginationContainer.innerHTML = "";

            // Nút Previous
            const prevButton = document.createElement("button");
            prevButton.innerHTML = "&larr;"; // Mũi tên trái
            prevButton.className = `px-3 py-2 rounded ${currentPage > 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`;
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    paginationState[elementId]--; // Giảm trạng thái trang của bảng hiện tại
                    renderPaginatedTable(elementId, data, emptyMessage, rowRenderer);
                }
            });

            // Hiển thị trang hiện tại và tổng số trang
            const pageInfo = document.createElement("span");
            pageInfo.textContent = `${currentPage}/${totalPages}`;
            pageInfo.className = "mx-4 text-gray-700 font-semibold";

            // Nút Next
            const nextButton = document.createElement("button");
            nextButton.innerHTML = "&rarr;"; // Mũi tên phải
            nextButton.className = `px-3 py-2 rounded ${currentPage < totalPages ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`;
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    paginationState[elementId]++; // Tăng trạng thái trang của bảng hiện tại
                    renderPaginatedTable(elementId, data, emptyMessage, rowRenderer);
                }
            });

            // Thêm các phần tử vào container
            paginationContainer.appendChild(prevButton);
            paginationContainer.appendChild(pageInfo);
            paginationContainer.appendChild(nextButton);
        }
    }
};

const goToOrderPage = (orderCode) => {
    dialogConfirm(
        () => {
            window.location.href = `/views/Oder/OderScreen.html?orderCode=${encodeURIComponent(orderCode)}`;
        },
        () => {
            // Callback khi người dùng chọn "Không"
            console.log("Người dùng đã hủy hành động.");
        }
    );

};

// Hàm lấy dữ liệu đơn hàng
const getAllUserOrders = async () => {
    try {
        const url = `http://localhost:3000/invoice/getAllUserOrders?startDate=${startDate.format("YYYY-MM-DD")}&endDate=${endDate.format("YYYY-MM-DD")}`;
        const { data } = await fetchData(url);

        const title = document.getElementById("sum_oder");
        title.innerText = data.length;

        renderPaginatedTable("tbody_oder", data, "Không đơn hàng mới nào trong ngày hôm nay", (item, index) => {
            const { user, order } = item;

            return /*html*/ `
                <tr class="border-b">
                    <td class="py-2 px-4">${index + 1}</td>
                    <td class="py-2 px-4">
                      <p>Tên: ${user.name}</p>
                      <p>Email: ${user.email}</p>
                      <p>Phone: ${user.phone_number || "N/A"}</p>
                    </td>
                    <td class="py-2 px-4">${order.total_price.toLocaleString('vi-VN')}đ</td>
                    <td class="py-2 px-4">${user.roles.join(", ")}</td>
                    <td class="py-2 px-4 align-middle">
                      <span class="bg-blue-200 text-blue-800 py-1 px-2 rounded align-middle">${order.status}</span>
                    </td>
                    <td class="py-2 px-4">${order.order_date.toLocaleString("vi-VN")}</td>
                    <td>
            <button onclick="goToOrderPage('${order.code}')" class="btn-view-order">Xem chi tiết</button>
        </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
    }
};

// Hàm lấy dữ liệu người dùng mới
const getNewUser = async () => {
    try {
        const url = `http://localhost:3000/user/getNewUsers?startDate=${startDate.format("YYYY-MM-DD")}&endDate=${endDate.format("YYYY-MM-DD")}`;
        const { success, result } = await fetchData(url);

        const title = document.getElementById("sum_user");
        title.innerText = result.length;

        renderPaginatedTable("tbody_user", result, "Không có người dùng mới nào trong ngày hôm nay", (item, index) => {
            return /*html*/ `
                <tr class="border-b">
                    <td class="py-2">${index + 1}</td>
                    <td class="py-2">
                      ${item.name}<br />
                      ${item.email}
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    }
};

// Hàm lấy dữ liệu sản phẩm mới
const getNewProduct = async () => {
    try {
        const url = `http://localhost:3000/product/getProductsToday?startDate=${startDate.format("YYYY-MM-DD")}&endDate=${endDate.format("YYYY-MM-DD")}`;
        const { success, result } = await fetchData(url);

        const title = document.getElementById("sum_product");
        title.innerText = result.length;

        renderPaginatedTable("tbody_product", result, "Không có sản phẩm mới nào trong ngày hôm nay", (item, index) => {
            const product = item.product;
            const categories = item.categories;
            const supplier = item.supplier;

            return /*html*/ `
            <tr class="border-b">
                      <td class="py-2">
                       ${product.name}
                      </td>
                      <td class="py-2">${categories.map(item => item.name).join(", ")}</td>
                      <td class="py-2">${supplier.name}</td>
                      <td class="py-2">${product.price.toLocaleString('vi-VN')}</td>
                    </tr>
            `;
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    }
};

// Gọi dữ liệu lần đầu
loadData();
