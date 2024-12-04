const headers = {
    Authorization: "trinh_nhung",
    "Content-Type": "application/json",
};

const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");
const daySelect = document.getElementById("daySelect");

// Lấy năm, tháng, ngày hiện tại
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth() + 1; // Tháng (1-12)
let currentDay = currentDate.getDate(); // Ngày (1-31)

// Hàm khởi tạo danh sách năm
function populateYears() {
    const maxYear = new Date().getFullYear(); // Năm hiện tại
    const minYear = 2000; // Giới hạn năm thấp nhất
    for (let year = maxYear; year >= minYear; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear; // Đặt giá trị mặc định là năm hiện tại
}

// Hàm khởi tạo danh sách tháng
function populateMonths() {
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = `Tháng ${month}`;
        monthSelect.appendChild(option);
    }
    monthSelect.value = currentMonth; // Đặt giá trị mặc định là tháng hiện tại
}

// Hàm khởi tạo danh sách ngày
function populateDays(year, month) {
    daySelect.innerHTML = ""; // Xóa ngày cũ
    const daysInMonth = new Date(year, month, 0).getDate(); // Số ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement("option");
        option.value = day;
        option.textContent = `Ngày ${day}`;
        daySelect.appendChild(option);
    }
    daySelect.value = currentDay; // Đặt giá trị mặc định là ngày hiện tại
}

// Hàm xử lý khi giá trị combobox thay đổi
function handleDateChange() {
    currentYear = parseInt(yearSelect.value, 10);
    currentMonth = parseInt(monthSelect.value, 10);
    currentDay = parseInt(daySelect.value, 10);

    // Kiểm tra ngày hợp lệ (nếu thay đổi tháng hoặc năm)
    const maxDays = new Date(currentYear, currentMonth, 0).getDate();
    if (currentDay > maxDays) {
        currentDay = maxDays;
        daySelect.value = currentDay;
    }

    // Gọi API hoặc cập nhật dữ liệu
    fetchData();
}

// Gán sự kiện thay đổi cho các combobox
yearSelect.addEventListener("change", () => {
    handleDateChange();
    populateDays(currentYear, currentMonth); // Cập nhật lại ngày theo tháng và năm mới
});
monthSelect.addEventListener("change", () => {
    handleDateChange();
    populateDays(currentYear, currentMonth); // Cập nhật lại ngày theo tháng mới
});
daySelect.addEventListener("change", handleDateChange);

// Gọi hàm khởi tạo combobox khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    populateYears();
    populateMonths();
    populateDays(currentYear, currentMonth);
    fetchData(); // Gọi dữ liệu ban đầu
});
async function fetchData() {
    const year = currentYear;
    const month = currentMonth
    const day = currentDay

    fetchDataAndRenderChart(year);
    // fetchTopProducts(month, year);
    fetchTopProducts22(month, year)
    data1(year, month, day)
}
// Gọi API và vẽ biểu đồ cột doanh thu hàng tháng
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

// Gọi API và vẽ biểu đồ tròn doanh thu theo sản phẩm
let donutChart; // Khai báo biến donutChart ở phạm vi toàn cục

// async function fetchTopProducts(month, year) {
//     try {
//         // Gửi yêu cầu API để lấy dữ liệu
//         const formattedMonth = month.toString().padStart(2, "0"); // Định dạng "01", "02",...
//         const response = await fetch(`http://localhost:3000/invoice/top-products?month=${formattedMonth}&year=${year}`, { headers });
//         let data = await response.json();

//         // Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
//         var checkData = true;
//         if (!data || data.length === 0) {
//             checkData = false;
//             console.log('Dữ liệu rỗng, sử dụng dữ liệu ảo');
//             data = [
//                 { productName: "Sản phẩm 1", totalQuantity: 60, totalPrice: 60 },
//                 { productName: "Sản phẩm 2", totalQuantity: 90, totalPrice: 60 },
//                 { productName: "Sản phẩm 3", totalQuantity: 30, totalPrice: 60 },
//                 { productName: "Sản phẩm 4", totalQuantity: 120, totalPrice: 60 },
//                 { productName: "Sản phẩm 5", totalQuantity: 60, totalPrice: 60 }
//             ];
//         }

//         // Tách dữ liệu từ API
//         const productNames = data.map(item => item.productName);
//         const quantities = data.map(item => item.totalQuantity);
//         const revenues = data.map(item => item.totalPrice);

//         // Tạo mảng tên sản phẩm giả cho phần chú thích
//         const fakeProductNames = Array.from({ length: productNames.length }, (_, index) => `Sản phẩm ${index + 1}`);

//         function formatCurrency(value) {
//             return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
//         }

//         // Nếu donutChart đã tồn tại, hủy bỏ biểu đồ cũ trước khi tạo mới
//         if (donutChart) {
//             donutChart.destroy();
//         }

//         // Biểu đồ Donut - Hiển thị tỷ lệ Số lượng
//         const donutOptions = {
//             chart: {
//                 type: 'donut',
//                 width: '100%', // Responsive width
//             },
//             series: quantities,
//             labels: fakeProductNames, // Sử dụng tên giả cho phần chú thích
//             title: {
//                 text: `Top 5 Sản Phẩm Bán Chạy Nhất Tháng ${formattedMonth}/${year} - Doanh Thu và Số Lượng`,
//                 align: 'center',
//                 style: {
//                     fontSize: '20px',
//                     fontWeight: 'bold'
//                 }
//             },
//             subtitle: {
//                 text: checkData ? "" : "Không có dữ liệu", // Hiển thị thông báo nếu không có dữ liệu
//                 align: 'center',
//                 style: {
//                     fontSize: '16px',
//                     color: '#FF0000',  // Màu đỏ cho thông báo lỗi
//                     fontWeight: 'bold'
//                 }
//             },
//             tooltip: {
//                 y: {
//                     formatter: function (val, opts) {
//                         const revenue = revenues[opts.seriesIndex]; // Tổng tiền bán ra
//                         const productName = productNames[opts.seriesIndex]; // Lấy tên sản phẩm thật khi hover
//                         return `Số lượng: ${val.toLocaleString()} <br><strong>${productName}</strong><br>Doanh thu: ${formatCurrency(revenue)}`;
//                     }
//                 },
//                 style: {
//                     fontSize: '14px', // Tooltip font size
//                 },
//                 custom: function ({ seriesIndex, series, dataPointIndex, w }) {
//                     // Set maximum width for the tooltip and make sure text wraps
//                     const tooltip = w.globals.tooltip;
//                     tooltip.style.maxWidth = '300px'; // Limit width to 300px
//                     tooltip.style.whiteSpace = 'normal'; // Allow wrapping of text
//                 }
//             },
//             colors: ['#1E90FF', '#FF6347', '#32CD32', '#FFD700', '#6A5ACD'],
//             responsive: [{
//                 breakpoint: 768,
//                 options: {
//                     chart: {
//                         width: '100%',
//                     },
//                     legend: {
//                         position: 'bottom'
//                     }
//                 }
//             }]
//         };

//         donutChart = new ApexCharts(document.querySelector("#donutChart"), donutOptions);
//         donutChart.render();

//     } catch (error) {
//         console.error(error);
//     }
// }
let donutChart2;
async function fetchTopProducts22(month, year) {
    try {
        const formattedMonth = month.toString().padStart(2, "0");
        const response = await fetch(
            `http://localhost:3000/invoice/top-products?month=${formattedMonth}&year=${year}`,
            {
                headers: {
                    Authorization: "trinh_nhung",
                    "Content-Type": "application/json",
                },
            }
        );
        let data = await response.json();

        // Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
        var checkData = true;
        if (!data || data.length === 0) {
            checkData = false;
            console.log("Dữ liệu rỗng, sử dụng dữ liệu ảo");
            data = [
                { productName: "Sản phẩm 1", totalQuantity: 60, totalPrice: 60 },
                { productName: "Sản phẩm 2", totalQuantity: 90, totalPrice: 60 },
                { productName: "Sản phẩm 3", totalQuantity: 30, totalPrice: 60 },
                { productName: "Sản phẩm 4", totalQuantity: 120, totalPrice: 60 },
                { productName: "Sản phẩm 5", totalQuantity: 60, totalPrice: 60 }
            ];
        }

        const productNames = data.map((item) => item.productName);
        const quantities = data.map((item) => item.totalQuantity);
        const revenues = data.map(item => item.totalPrice);
        // Lấy đối tượng chart
        const chart = echarts.init(document.getElementById("chart"));

        // Cấu hình biểu đồ Radius Mode với Toolbox
        const option = {
            title: {
                text: `Top 5 Sản Phẩm Bán Chạy Nhất Tháng ${formattedMonth}/${year}`,
                subtext: "Doanh Thu và Số Lượng",
                left: "center",
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
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true },
                },
            },
            tooltip: {
                trigger: "item",
                formatter: function (params) {
                    console.log(params, "params")
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
                    radius: [20, 140], // Tạo hiệu ứng tròn và phần các sản phẩm thay đổi theo giá trị
                    center: ["50%", "50%"], // Đặt vị trí trung tâm của biểu đồ
                    roseType: "radius", // Tạo hiệu ứng hoa hồng (sản phẩm có tỷ lệ lớn sẽ lớn hơn)
                    data: data.map((item) => ({
                        value: item.totalQuantity,
                        name: item.productName,
                    })),
                    itemStyle: {
                        borderRadius: 5,
                        borderColor: "#fff", // Viền trắng cho từng phần
                        borderWidth: 1
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {c} ({d}%)', // Hiển thị tên sản phẩm, số lượng và phần trăm
                        color: "#34495e", // Màu chữ
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
                    ], // Màu sắc sinh động cho các phần của biểu đồ
                },
            ],
        };

        // Set option cho biểu đồ
        chart.setOption(option);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}
const content = document.querySelector("#content");
const data1 = async (year, month, day) => {
    console.log(year, month, day, "aaaa")
    document.getElementById("tv1").textContent = `Thống kê ngày: ${day}-${month}-${year}`
    document.getElementById("tv2").textContent = `Những sản phẩm đã được bán ra trong ngày: ${day}-${month}-${year}`

    try {
        // Gửi request đến API
        const response = await fetch(`http://localhost:3000/invoice/statistics_by_date?year=${year}&month=${month}&day=${day}`, {
            headers: {
                Authorization: "trinh_nhung",
                "Content-Type": "application/json",
            },

        });

        // Kiểm tra nếu có lỗi
        if (!response.ok) {
            throw new Error('Error fetching data');
        }

        // Parse dữ liệu trả về
        const data = await response.json();

        // Hiển thị kết quả tổng quan
        document.getElementById("totalOrders").textContent = data.totalOrders || 0;
        document.getElementById("totalRevenue").textContent = data.totalRevenue || 0;

        // Hiển thị sản phẩm bán chạy
        const productsTableBody = document.getElementById("productsTable").querySelector("tbody");
        productsTableBody.innerHTML = ""; // Xóa dữ liệu cũ

        if (data.topProducts && data.topProducts.length > 0) {
            data.topProducts.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = /*html*/`
                  <td class="border border-gray-300 py-2 w-[180px]"> 
          <div class=" h-[220px]  flex justify-center items-center ">
                  <img
                    alt="Product image"
                    class="w-full h-full object-contain"
                    src="${product.image[0]}"
                  />
                </div>
                </td>
                    <td class="border border-gray-300 px-4 py-2">${product.name}</td>
                    <td class="border border-gray-300 px-4 py-2">${product.totalQuantity}</td>
                `;
                productsTableBody.appendChild(row);
            });
        } else {
            // Nếu không có sản phẩm nào, hiển thị thông báo
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.setAttribute("colspan", "3");
            cell.classList.add("px-4", "py-2", "text-center", "text-sm", "text-red-500", "font-bold");
            cell.textContent = "Không có sản phẩm nào ";
            row.appendChild(cell);
            productsTableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Failed to fetch data. Please try again.");
    }
}