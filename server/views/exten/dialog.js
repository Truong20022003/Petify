const dialogSuccessLogin = (title, redirectUrl) => {
    Swal.fire({
        position: "center",
        icon: "success",
        title: title,
        showConfirmButton: false,
        timer: 2000,
    }).then(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    });
};

const dialogInfo = (title, onSave, onCancel) => {
    Swal.fire({
        title: title,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Lưu",
        denyButtonText: `Không lưu`,
    }).then((result) => {
        if (result.isConfirmed) {
            if (onSave && typeof onSave === "function") {
                onSave();
            }
        } else if (result.isDenied) {
            // Khi người dùng ấn "Don't save"
            Swal.fire("Nhưng thay đổi không được lưu", "", "info");
            if (onCancel && typeof onCancel === "function") {
                onCancel();
            }
        }
    });
};
const dialogConfirm = (onConfirm, onCancel) => {
    Swal.fire({
        title: "Bạn chắc chứ",
        text: "Chúng tôi sẽ chuyển bạn đến trang đích",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có",
        cancelButtonText: "Không",
    }).then((result) => {
        if (result.isConfirmed) {
            if (onConfirm && typeof onConfirm === "function") {
                onConfirm(); // Gọi callback khi người dùng chọn "Có"
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            if (onCancel && typeof onCancel === "function") {
                onCancel(); // Gọi callback khi người dùng chọn "Không"
            }
        }
    });
};

const dialogDelete = (title, text, onConfirm) => {
    Swal.fire({
        title: title || "Bạn có chắc chứ?",
        text: text || "Bạn sẽ không thể khôi phục lại!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Tôi đồng ý",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
            }).then(() => {
                if (onConfirm && typeof onConfirm === "function") {
                    onConfirm(); // Gọi callback để thực hiện hành động xóa
                }
            });
        }
    });
};
const dialogDeleteProduct = (title, text, onConfirm, onError) => {
    Swal.fire({
        title: title || "Bạn có chắc chứ?",
        text: text || "Bạn sẽ không thể khôi phục lại!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Tôi đồng ý",
    }).then((result) => {
        if (result.isConfirmed) {
            if (onConfirm && typeof onConfirm === "function") {
                onConfirm(); // Gọi callback để thực hiện hành động xóa
            }
        }
    });
};

const dialogSuccess = (title) => {
    return Swal.fire({
        title: title,
        icon: "success",
        showConfirmButton: false,
        timer: 1500 // Hiển thị thông báo trong 1.5 giây
    });
}
const dialogError = (title, text) => {
    Swal.fire({
        icon: "error",
        title: title,
        text: text,
    });
}
const dialogWarning = (title, text) => {
    Swal.fire({
        icon: "warning",
        title: title,
        text: text,
    });
}
const dialogLoading = (title) => {
    return Swal.fire({
        title: title,
        html: "Đợi 1 tý 🤫....",
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false, // Không cho phép người dùng bấm ra ngoài để đóng
    });
};
const dialogDetailUser = (data) => {
    Swal.fire({
        html: /*html*/`
          <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div class="flex flex-col items-center">
              <img alt="Avatar" class="w-32 h-32 rounded-full object-cover mb-4" height="150" src="${data.avata}" width="150"/>
              <div class="w-full">
                <div class="flex justify-between mb-2">
                  <span class="font-bold">Email:</span>
                  <span>${data.email}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="font-bold">Tên:</span>
                  <span>${data.name}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="font-bold">Địa chỉ:</span>
                  <span>${data.location}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="font-bold">Tên tài khoản:</span>
                  <span>${data.user_name}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="font-bold">Số điện thoại:</span>
                  <span>${data.phone_number}</span>
                </div>
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold">Mật khẩu:</span>
                  <div class="relative">
                    <!-- Đổi type mật khẩu là 'password' mặc định, không viền -->
                    <input id="password" type="password" value="${data.password}" class="border-none outline-none p-2 w-40 text-gray-700" style="background-color: transparent;"/>
                    <i id="togglePassword" class="fas fa-eye-slash cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,

        confirmButtonText: 'OK',
        didOpen: () => {
            // Lấy phần tử mật khẩu và biểu tượng con mắt
            const passwordInput = document.getElementById('password');
            const togglePassword = document.getElementById('togglePassword');

            // Thêm sự kiện click vào biểu tượng con mắt
            togglePassword.addEventListener('click', () => {
                // Kiểm tra xem mật khẩu đang ở chế độ ẩn hay hiện
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text'; // Chuyển thành kiểu text (hiển thị mật khẩu)
                    togglePassword.classList.replace('fa-eye-slash', 'fa-eye'); // Đổi icon thành con mắt
                } else {
                    passwordInput.type = 'password'; // Chuyển thành kiểu password (ẩn mật khẩu)
                    togglePassword.classList.replace('fa-eye', 'fa-eye-slash'); // Đổi icon thành mắt đóng
                }
            });
        }
    });
}



const dialogInvoice = (data, dataUser, invoiceDetailHTML, carrier) => {
    console.log(data, "dialog");

    // Hàm format số với dấu chấm phân cách hàng nghìn
    const formatNumberWithComma = (number) => {
        return number.toLocaleString('vi-VN');
    };

    const formatInvoiceDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm '0' nếu cần
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (tháng bắt đầu từ 0, phải cộng thêm 1)
        const year = date.getFullYear(); // Lấy năm
        const hour = String(date.getHours()).padStart(2, '0'); // Lấy giờ, thêm '0' nếu cần
        const minute = String(date.getMinutes()).padStart(2, '0'); // Lấy phút, thêm '0' nếu cần
        const second = String(date.getSeconds()).padStart(2, '0'); // Lấy giây, thêm '0' nếu cần

        return `${day}-${month}-${year}  ${hour}H:${minute}m`; // Định dạng theo kiểu dd-MM-yyyy HH-mm-ss
    };

    const totalAmount = Number(data.total) + Number(data.shipping_fee);
    const filteredEmail = dataUser.email.split('@')[0];

    Swal.fire({
        html: /*html*/`
        <div class="max-w-4xl mx-auto border-4 border-gray-300 p-8 rounded-lg bg-white relative" id="invoice-content">
            <!-- Header -->
            <div class="text-center mb-6">
                <h1 class="text-3xl font-semibold text-green-900">${dataUser.name}</h1>
                <p class="text-lg text-green-700 mt-2"><strong><~ P E T I F Y ~></strong></p>
            </div>

            <!-- Order Information Section -->
            <div class="mb-8 border-b-2 pb-6">
                <h2 class="text-2xl font-bold text-green-800 mb-4">THÔNG TIN HÓA ĐƠN</h2>
                <div class="grid grid-cols-2 gap-6">
                    <!-- Customer Info Left -->
                    <div class="space-y-3">
                    <!-- Phone Number -->
                    <div class="flex items-center">
                        <p class="font-medium text-green-900">Điện thoại:</p>
                        <p class="ml-2 text-gray-700">${dataUser.phone_number}</p>
                    </div>
                    <!-- Address -->
                    <div class="flex items-center">
                        <p class="font-medium text-green-900">Địa chỉ:</p>
                        <p class="ml-2 text-gray-700">${dataUser.location}</p>
                    </div>
                </div>
                    <!-- Customer Info Right -->
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <p class="font-medium text-green-900">Email:</p>
                            <p class="ml-2 text-gray-700">${dataUser.email}</p>
                        </div>
                        <div class="flex items-center">
                            <p class="font-medium text-green-900">Ngày lập hóa đơn:</p>
                            <p class="ml-2 text-gray-700">${formatInvoiceDate(new Date(data.date))}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Table -->
            <div class="mb-8">
                <h3 class="text-2xl font-bold text-green-800 mb-4">CHI TIẾT SẢN PHẨM</h3>
                <table class="w-full table-auto border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="py-2 text-left px-4 w-[30]">Ảnh</th>
                            <th class="py-2 text-left px-4 w-[140]">Tên sản phẩm</th>
                            <th class="py-2 text-center px-4v w-[30]">Số lượng</th>
                            <th class="py-2 text-center px-4  w-[30]">Đơn giá</th>
                            <th class="py-2 text-center px-4  w-[40]">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceDetailHTML} <!-- Rendered product rows will go here -->
                    </tbody>
                </table>
            </div>

            <!-- Order Summary -->
            <div class="text-right mb-8">
                <div class="mb-2">
                    <p class="font-semibold text-green-800">Tổng tiền đơn hàng: <span class="text-xl text-red-500">${formatNumberWithComma(data.total)}đ</span></p>
                </div>
                <!-- <div class="mb-2">
                    <p class="text-gray-700">Trạng thái đơn hàng: <span class="font-semibold text-blue-600">${data.status}</span></p>
                </div> -->
                <div class="mb-2">
                    <p class="text-gray-700">Hình thức thanh toán: <span class="font-semibold text-blue-600">${data.payment_method}</span></p>
                </div>
                <div class="mb-2">
                    <p class="text-gray-700">Phí vận chuyển: <span class="font-semibold text-blue-600">${formatNumberWithComma(Number(data.shipping_fee))}đ</span></p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700">Hình thức vận chuyển: <span class="font-semibold text-blue-600">${carrier}</span></p>
                </div>
            </div>

            <!-- Total Payment -->
            <div class="text-right mb-8">
                <p class="font-bold text-green-900 text-2xl">Tổng tiền thanh toán: <span class="text-2xl text-red-500">${formatNumberWithComma(totalAmount)}đ</span></p>
            </div>

            <!-- Footer -->
            <div class="flex justify-between mt-8 border-t-2 pt-4">
                <div>
                    <p class="text-sm text-gray-700">Xin chào, <span class="font-bold">${dataUser.name}</span></p>
                    <p class="text-sm text-gray-700">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-700">Email: ${filteredEmail}</p>
                    <p class="text-sm text-gray-700">${dataUser.phone_number}</p>
                    <p class="text-sm text-gray-700">${dataUser.location}</p>
                </div>
            </div>

            <!-- Download Icons -->
            <div class="absolute top-4 right-4 flex space-x-4">
                <i class="fas fa-file-pdf text-2xl cursor-pointer" id="download-pdf" title="Download PDF"></i>
                <i class="fas fa-image text-2xl cursor-pointer" id="download-image" title="Download Image"></i>
            </div>

        </div>`,
        customClass: {
            popup: 'w-full max-w-4xl' // Increase max width for the popup
        },
        didOpen: () => {
            // Attach download actions to the icons
            document.getElementById("download-pdf").addEventListener("click", () => {
                const invoiceContent = document.querySelector("#invoice-content");
                generatePDF(invoiceContent);
            });

            document.getElementById("download-image").addEventListener("click", () => {
                const invoiceContent = document.querySelector("#invoice-content");
                generateImage(invoiceContent);
            });
        }
    });

    // Hàm tạo file PDF từ nội dung HTML 
    const generatePDF = (invoiceContent) => { html2canvas(invoiceContent, { useCORS: true }).then((canvas) => { const imgData = canvas.toDataURL('image/png'); const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4'); const imgProps = pdf.getImageProperties(imgData); const pdfWidth = pdf.internal.pageSize.getWidth(); const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); pdf.save('invoice.pdf'); }).catch((error) => { console.error('html2canvas error:', error); }); };
    // Hàm tạo ảnh từ nội dung HTML
    const generateImage = (invoiceContent) => {
        console.log("Starting html2canvas...");
        html2canvas(invoiceContent, { useCORS: true }).then((canvas) => {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = 'invoice.png';
            link.click();
        }).catch((error) => {
            console.error('html2canvas error:', error);
        });
    };
};

const dialogOder = (data, dataUser, invoiceDetailHTML, carrier) => {
    console.log(data, "dialog");
    // Hàm format số với dấu chấm phân cách hàng nghìn
    const formatNumberWithComma = (number) => {
        return number.toLocaleString('vi-VN');
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

    const totalAmount = Number(data.total) + Number(data.shipping_fee);
    const filteredEmail = dataUser.email.split('@')[0];
    Swal.fire({
        html: /*html*/`
        <div class="max-w-4xl mx-auto border-4 border-gray-300 p-8 rounded-lg bg-white">
            <!-- Header -->
            <div class="text-center mb-6">
                <h1 class="text-3xl font-semibold text-green-900">${dataUser.name}</h1>
                <p class="text-lg text-green-700 mt-2"><strong><~ P E T I F Y ~></strong></p>
            </div>

            <!-- Order Information Section -->
            <div class="mb-8 border-b-2 pb-6">
                <h2 class="text-2xl font-bold text-green-800 mb-4">THÔNG TIN HÓA ĐƠN</h2>
                <div class="grid grid-cols-2 gap-6">
                    <!-- Customer Info Left -->
                    <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <p class="font-medium text-green-900">Điện thoại Khách hàng:</p>
                        <p class="text-sm text-gray-700 flex-grow">${dataUser.phone_number}</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="font-medium text-green-900">Địa chỉ Khách hàng:</p>
                        <p class="text-sm text-gray-700 flex-grow">${dataUser.location}</p>
                    </div>
                    </div>

                    <!-- Customer Info Right -->
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <p class="font-medium text-green-900">Email:</p>
                            <p class="text-sm text-gray-700">${dataUser.email}</p>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="font-medium text-green-900">Ngày lập hóa đơn:</p>
                            <p class="text-sm text-gray-700">${formatInvoiceDate(new Date(data.date))}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Table -->
            <div class="mb-8">
                <h3 class="text-2xl font-bold text-green-800 mb-4">CHI TIẾT SẢN PHẨM</h3>
                <table class="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="py-2 text-left px-4">Ảnh</th>
                            <th class="py-2 text-left px-4">Tên sản phẩm</th>
                            <th class="py-2 text-center px-4">Số lượng</th>
                            <th class="py-2 text-center px-4">Đơn giá</th>
                            <th class="py-2 text-center px-4">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceDetailHTML} <!-- Rendered product rows will go here -->
                    </tbody>
                </table>
            </div>

            <!-- Order Summary -->
            <div class="text-right mb-8">
                <div class="mb-2">
                    <p class="font-semibold text-green-800">Tổng tiền đơn hàng: <span class="text-xl text-red-500">${formatNumberWithComma(data.total_price)}đ</span></p>
                </div>
                <div class="mb-2">
                    <p class="text-gray-700">Trạng thái đơn hàng: <span class="font-semibold text-blue-600">${data.status}</span></p>
                </div>
                <div class="mb-2">
                    <p class="text-gray-700">Hình thức thanh toán: <span class="font-semibold text-blue-600">${data.payment_method}</span></p>
                </div>
                </div>
            </div>
            <!-- Footer -->
            <div class="flex justify-between mt-8 border-t-2 pt-4">
                <div>
                    <p class="text-sm text-gray-700">Xin chào, <span class="font-bold">${dataUser.name}</span></p>
                    <p class="text-sm text-gray-700">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-700">Email: ${filteredEmail}</p>
                    <p class="text-sm text-gray-700">${dataUser.phone_number}</p>
                    <p class="text-sm text-gray-700">${dataUser.location}</p>
                </div>
            </div>
        </div>`,
        confirmButtonText: 'OK',
        customClass: {
            popup: 'w-full max-w-4xl' // Increase max width for the popup
        }
    });
}







