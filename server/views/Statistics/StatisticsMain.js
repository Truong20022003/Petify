const headers = {
    Authorization: "trinh_nhung",
    "Content-Type": "application/json",
};
document.addEventListener('DOMContentLoaded', () => {
    const today = dayjs(); // Lấy ngày hiện tại
    const formattedToday = today.format('YYYY-MM-DD'); // Định dạng thành 'YYYY-MM-DD'
    const year = today.year(); // Lấy năm
    const month = today.month() + 1; // Lấy tháng (cộng 1 vì month bắt đầu từ 0)
    const day = today.date(); // Lấy ngày

    if (!startDateInput.value) {
        startDateInput.value = formattedToday;
        endDateInput.value = formattedToday;

        fetchDataAndRenderChart(year); // Chỉ truyền năm
        productTop5(year, month, day); // Truyền đầy đủ năm, tháng, ngày
        fetchStatus();
        checkData()
        checkOderClear()
        fetchRevenueData()
    }
});

// Áp dụng phạm vi ngày từ 2 ô input
applyBtn.addEventListener('click', () => {
    if (startDateInput.value && endDateInput.value) {
        // Lấy giá trị từ input
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        const year = dayjs(startDate).year();
        const month = dayjs(startDate).month() + 1;
        const day = dayjs(startDate).date();

        fetchDataAndRenderChart(year);
        productTop5(year, month, day);
        fetchStatus();
        checkData()
        checkOderClear()
        fetchRevenueData()
        datePickerModal.classList.add('hidden');
    } else {
        alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
    }
});
////
async function fetchDataAndRenderChart(year) {
    try {
        const response = await fetch(`http://localhost:3000/invoice/revenue-by-month/${year}`, { headers });
        const monthlyData = await response.json();

        const months = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];

        // Tạo dữ liệu cho biểu đồ
        const revenueData = monthlyData.map(item => item.totalRevenue);
        const ordersData = monthlyData.map(item => item.totalOrders);
        console.log(monthlyData, "monthlyData")
        // Khởi tạo biểu đồ
        var chart = echarts.init(document.getElementById('comboChart'));


        const formatMoney = (value) => {
            if (value >= 1e12) {
                return (value / 1e12).toFixed(1) + 'T'; // Nghìn tỷ
            } else if (value >= 1e9) {
                return (value / 1e9).toFixed(1) + 'B'; // Tỷ
            } else if (value >= 1e6) {
                return (value / 1e6).toFixed(1) + 'M'; // Triệu
            } else if (value >= 1e5) {
                return value.toLocaleString(); // Trăm nghìn, hiển thị số bình thường
            } else {
                return value.toLocaleString(); // Hiển thị số bình thường nếu dưới trăm nghìn
            }
        };

        var option = {
            title: {
                text: `Doanh Thu và Đơn Hàng Trong Năm ${year}`,
                left: 'center',
                textStyle: {
                    color: '#2d3e50', // Màu chữ tối cho tiêu đề
                    fontSize: 26,
                    fontWeight: 'bold',
                    textShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' // Đổ bóng nhẹ cho tiêu đề
                },
                subtext: "Giải thích ký hiệu: M = Triệu, B = Tỷ, T = Nghìn tỷ",
                subtextStyle: {
                    color: '#777',  // Màu chữ cho giải thích
                    fontSize: 12,
                    fontStyle: 'italic'
                },
                padding: [0, 0, 50, 0]
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Nền tooltip tối với độ trong suốt nhẹ để không làm mất đi phần biểu đồ phía dưới
                textStyle: {
                    color: '#ffffff', // Chữ trắng trong tooltip
                    fontSize: 14, // Kích thước chữ dễ đọc hơn
                    fontWeight: 'bold' // Chữ đậm để nổi bật hơn
                },
                padding: [10, 20, 10, 20], // Thêm khoảng đệm cho tooltip để các giá trị không bị sát vào viền
                shadowColor: 'rgba(0, 0, 0, 0.3)', // Đổ bóng nhẹ cho tooltip để nổi bật hơn
                shadowBlur: 10, // Độ mờ của bóng,
                borderWidth: 0,
                formatter: function (params) {
                    var revenue = params[0].value; // Lấy nguyên giá trị doanh thu
                    var orders = params[1].value;  // Lấy số đơn hàng
                    return `<div style="color: #ffffff; font-size: 14px;">
                      ${params[0].name}<br/>
                        <b>Doanh Thu: </b>${revenue.toLocaleString()} VND<br/> <!-- Thêm VND để rõ ràng hơn -->
                        <b>Số Đơn Hàng: </b>${orders}
                    </div>`;
                }
            },
            legend: {
                data: ['Doanh Thu', 'Số Đơn Hàng'],
                top: '10%',
                textStyle: {
                    color: '#333333', // Màu chữ tối cho legend
                    fontSize: 16
                },
                orient: 'horizontal', // Đặt legend theo chiều ngang
                padding: [10, 0] // Tạo khoảng cách cho legend nếu cần
            },
            xAxis: {
                type: 'category',
                data: months,
                axisLabel: {
                    rotate: 45,
                    fontSize: 14,
                    color: '#333333' // Màu chữ xám cho trục X
                },
                axisLine: {
                    lineStyle: {
                        color: '#ddd' // Màu xám nhạt cho viền trục
                    }
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Doanh Thu',
                    axisLabel: {
                        formatter: (value) => formatMoney(value),
                        color: 'rgb(70, 116, 185)' // Màu xanh lá nhẹ cho trục Doanh Thu
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(70, 116, 185)' // Viền xanh lá cho trục Doanh Thu
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0' // Màu sáng cho đường chia
                        }
                    }
                },
                {
                    type: 'value',
                    name: 'Số Đơn Hàng',
                    axisLabel: {
                        formatter: '{value}',
                        color: '#002' // Màu cam cho trục Số Đơn Hàng
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#000' // Viền cam cho trục Số Đơn Hàng
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0' // Màu sáng cho đường chia
                        }
                    }
                }
            ],
            series: [
                {
                    name: 'Doanh Thu',
                    type: 'bar',
                    data: revenueData,
                    yAxisIndex: 0,
                    itemStyle: {
                        color: '	rgb(106, 154, 251)' // Xanh lá cho cột Doanh Thu
                    },
                    emphasis: {
                        itemStyle: {
                            color: 'rgb(71, 102, 133)' // Màu tối hơn khi hover
                        }
                    },
                    barWidth: '50%',
                    borderColor: '#81C784', // Viền xanh nhạt
                    borderWidth: 2
                },
                {
                    name: 'Số Đơn Hàng',
                    type: 'line',
                    data: ordersData,
                    yAxisIndex: 1,
                    lineStyle: {
                        color: 'rgb(171, 176, 186)', // Cam cho đường line
                        width: 2,
                        type: 'solid'
                    },
                    itemStyle: {
                        color: 'rgb(106, 154, 251)',
                        borderWidth: 3,
                        borderColor: '#ffffff'
                    },
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 10,
                    emphasis: {
                        symbolSize: 14
                    },
                    borderColor: '#FF5722', // Viền cam nhạt
                    borderWidth: 3
                }
            ],
            animationDuration: 1500,
            animationEasing: 'elasticOut'
        };

        // Set option cho chart
        chart.setOption(option);
    } catch (error) {
        alert("Lỗi khi tải dữ liệu: " + error.message);
    }
}
///
document.getElementById('thoigian').innerText = `Từ ${startDateInput.value} đến ${endDateInput.value}`
const table_product = document.querySelector("#table_product");

const productTop5 = async (year, month, day) => {
    try {
        const startDate = startDateInput.value || `${year}-${month}-01`;
        const endDate = endDateInput.value || `${year}-${month}-${day}`;

        const response = await fetch(
            `http://localhost:3000/invoice/statisticsByDateRange?startDate=${startDate}&endDate=${endDate}`,
            { headers }
        );

        const data = await response.json();

        if (data.topProducts && data.topProducts.length > 0) {
            table_product.innerHTML = '';
            data.topProducts.forEach(product => {
                table_product.innerHTML += `
                <div class="flex items-center justify-between border-b py-2">
                    <div class="flex items-center">
                        <img alt="Product image" class="w-12 h-12 rounded mr-3" src="${product.image[0]}"/>
                        <div>
                            <div class="flex items-center">
                                <i class="fas fa-shopping-cart text-gray-500"></i>
                                <p class="ml-2">${product.purchaseCount} Lượt mua</p>
                            </div>
                        </div>
                    </div>
                    <div class="text-right w-1/3">
                        <p class="text-orange-500 font-semibold">${product.price.toLocaleString('vi-VN')}đ</p>
                        <p class="text-sm text-gray-500 truncate max-w-xs">${product.name}</p>
                    </div>
                </div>
            `;
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Failed to fetch data. Please try again.");
    }
};
async function fetchStatus() {
    try {
        const startDate = startDateInput.value || "2024-01-01";
        const endDate = endDateInput.value || "2024-12-31";

        console.log(startDate, "startDate status")
        console.log(endDate, "endDate status")

        const response = await fetch(
            `http://localhost:3000/invoice/statisticsByDateRangeStatus?startDate=${startDate}&endDate=${endDate}`,
            { headers }
        );
        const data = await response.json();

        // Kiểm tra nếu không có dữ liệu
        if (!data.statusStatistics || data.statusStatistics.length === 0) {
            console.error("Không có dữ liệu để hiển thị.");
            return;
        }

        // Lấy danh sách status để làm legend
        const productNames = data.statusStatistics.map(item => item.status);

        const chart = echarts.init(document.getElementById("chart"));
        const option = {
            title: {
                text: `Thống kê trạng thái đơn hàng`,
                left: "center",
                subtext: `(${startDate} đến ${endDate})`,
                textStyle: {
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#2c3e50", // Màu chữ tiêu đề
                },
                subtextStyle: {
                    color: "#e74c3c",
                    fontSize: 16,
                },
            },
            tooltip: {
                trigger: "item",
                formatter: function (params) {
                    return `${params.name}: Số lượng ${params.value.toLocaleString()} (${params.percent}%)`;
                },
                backgroundColor: "rgba(0,0,0,0.7)",
                borderColor: "#fff",
                textStyle: {
                    color: "#fff"
                },
            },
            legend: {
                left: "center",
                top: "bottom",
                data: productNames,
                textStyle: {
                    color: "#34495e",
                    fontSize: 14
                }
            },
            series: [
                {
                    name: "Top 5 Sản Phẩm Bán Chạy",
                    type: "pie",
                    radius: '65%',
                    center: ["50%", "50%"],
                    selectedMode: 'single',
                    data: data.statusStatistics.map((item) => ({
                        value: item.count,
                        name: item.status,
                    })),
                    itemStyle: {
                        borderRadius: 5,
                        borderColor: "#fff",
                        borderWidth: 1
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {c} ({d}%)',
                        color: "#34495e",
                        fontSize: 14,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: "bold",
                        },
                    },
                    color: [
                        "#FF6347", "#1E90FF", "#32CD32", "#FFD700", "#6A5ACD", "#FF4500", "#00BFFF", "#8A2BE2"
                    ],
                },
            ],
        };
        chart.setOption(option);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}
////danh sach don moi 
async function fetchRevenueData() {
    try {
        const response = await fetch(
            "http://localhost:3000/invoice/getMonthlyRevenue",
            { headers: { Authorization: "trinh_nhung" } }
        ); // Thay thế bằng URL thực tế của bạn
        const data = await response.json();

        if (data.message === "Thống kê doanh thu theo tháng thành công.") {
            renderRevenueTable(data.revenueByMonth, data.comparison);
        } else {
            console.error("Lỗi: Không lấy được dữ liệu");
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// Hàm hiển thị dữ liệu vào bảng
function renderRevenueTable(revenueByMonth, comparison) {
    const tableBody = document.getElementById("revenueTableBody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ trước khi chèn dữ liệu mới

    revenueByMonth.forEach((item, index) => {
        const lastMonthRevenue =
            index > 0 ? revenueByMonth[index - 1].totalRevenue : 0;
        const currentMonthRevenue = item.totalRevenue;
        const percentageChange = calculatePercentageChange(
            lastMonthRevenue,
            currentMonthRevenue
        );

        // Xử lý mũi tên
        const arrow =
            percentageChange > 0 ? "↑" : percentageChange < 0 ? "↓" : "";

        // Tạo dòng dữ liệu cho bảng
        const row = `
                <tr class="border-t">
                    <td class="px-4 py-2 text-gray-700">Tháng ${item.month
            }</td>
                    <td class="px-4 py-2 text-gray-700">${currentMonthRevenue.toLocaleString()} VND</td>
                    <td class="px-4 py-2 text-gray-700">
                        <span class="${percentageChange > 0
                ? "text-green-500"
                : "text-red-500"
            }">
                            ${percentageChange.toFixed(2)}% ${arrow}
                        </span>
                    </td>
                </tr>
            `;
        tableBody.innerHTML += row;
    });
}

// Hàm tính phần trăm thay đổi
function calculatePercentageChange(lastMonth, currentMonth) {
    if (lastMonth === 0 && currentMonth === 0) return 0;
    if (lastMonth === 0) return 100; // Nếu tháng trước là 0, tính là tăng trưởng 100%
    return ((currentMonth - lastMonth) / lastMonth) * 100;
}


const checkData = async () => {
    try {
        const startDate = startDateInput.value || "2024-01-01";
        const endDate = endDateInput.value || "2024-12-31";

        const response = await fetch(
            `http://localhost:3000/invoice/statisticsByDateRange?startDate=${startDate}&endDate=${endDate}`,
            { headers: { Authorization: "trinh_nhung" } }
        ); // Thay thế bằng URL thực tế của bạn
        const data = await response.json();
        console.log(data, "data")
        const { totalOrders, totalRevenue } = data
        const sum_doanhthu = document.getElementById("sum_doanhthu");
        console.log(sum_doanhthu, "sum_doanhthu")

        const sum_oder = document.getElementById("sum_invoice");


        sum_doanhthu.innerText = ` ${totalRevenue.toLocaleString('vi-VN')}đ`;
        sum_oder.innerText = totalOrders;


    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    }
}

const checkOderClear = async () => {
    try {
        const startDate = startDateInput.value || "2024-01-01";
        const endDate = endDateInput.value || "2024-12-31";

        const response = await fetch(
            `http://localhost:3000/invoice/getCancelledInvoices?startDate=${startDate}&endDate=${endDate}`,
            { headers: { Authorization: "trinh_nhung" } }
        ); // Thay thế bằng URL thực tế của bạn
        const data = await response.json();

        const sum_invoice_clear = document.getElementById("sum_oder_huy");
        sum_invoice_clear.innerText = data.count;


    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    }
}