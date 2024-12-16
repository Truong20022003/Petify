dayjs.extend(dayjs_plugin_isoWeek);
flatpickr("#startDate", {
    dateFormat: "Y/m/d",
});

flatpickr("#endDate", {
    dateFormat: "Y/m/d",
});
const openDatePickerBtn = document.getElementById("openDatePickerBtn");
const datePickerModal = document.getElementById("datePickerModal");
const cancelBtn = document.getElementById("cancelBtn");
const applyBtn = document.getElementById("applyBtn");
const todayBtn = document.getElementById("todayBtn");
const yesterdayBtn = document.getElementById("yesterdayBtn");
const thisWeekBtn = document.getElementById("thisWeekBtn");
const thisMonthBtn = document.getElementById("thisMonthBtn");
const threeDaysAgoBtn = document.getElementById("threeDaysAgoBtn");
const fiveDaysAgoBtn = document.getElementById("fiveDaysAgoBtn");
const lastWeekBtn = document.getElementById("lastWeekBtn");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const startTimeInput = document.getElementById('startTime');

let selectedStartDate = null;
let selectedEndDate = null;

// Lấy tất cả các nút
const buttons = document.querySelectorAll("#todayBtn, #yesterdayBtn, #thisWeekBtn, #thisMonthBtn, #threeDaysAgoBtn, #fiveDaysAgoBtn, #lastWeekBtn");

// Hàm thay đổi màu nền khi nút được chọn
function selectButton(event) {
    // Xóa lớp 'bg-green-500' khỏi tất cả các nút
    buttons.forEach(button => {
        button.classList.remove("bg-green-500", "text-white");
        button.classList.add("bg-gray-200", "text-black"); // Đặt lại màu nền của nút chưa được chọn
    });

    // Thêm lớp 'bg-green-500' và 'text-white' vào nút được chọn
    event.target.classList.add("bg-green-500", "text-white");
}

// Thêm sự kiện click cho từng nút
buttons.forEach(button => {
    button.addEventListener("click", selectButton);
});
// Function to set the date range
function setDateRange(startDate, endDate) {
    selectedStartDate = startDate;
    selectedEndDate = endDate;
    startDateInput.value = startDate.format("YYYY-MM-DD");
    endDateInput.value = endDate.format("YYYY-MM-DD");

    updateDateRange();
}

// Function to update the date range display
function updateDateRange() {
    if (selectedStartDate && selectedEndDate) {
        applyBtn.textContent = `Áp dụng`;
        applyBtn.disabled = false; // Enable the apply button when both dates are selected
    } else {
        applyBtn.textContent = `Chọn ngày`;
        applyBtn.disabled = true; // Disable if dates are not selected
    }
}

// Show date picker modal
openDatePickerBtn.addEventListener("click", () => {
    datePickerModal.classList.remove("hidden");
});

// Close date picker modal
cancelBtn.addEventListener("click", () => {
    datePickerModal.classList.add("hidden");
});

// Option buttons
todayBtn.addEventListener("click", () => {
    const today = dayjs();
    setDateRange(today, today);
});

yesterdayBtn.addEventListener("click", () => {
    const yesterday = dayjs().subtract(1, "day");
    setDateRange(yesterday, yesterday);
});


thisWeekBtn.addEventListener("click", () => {
    const startOfWeek = dayjs().startOf("isoWeek");  // Tuần bắt đầu từ Thứ hai
    const endOfWeek = dayjs().endOf("isoWeek");  // Tuần kết thúc vào Chủ nhật
    setDateRange(startOfWeek, endOfWeek);  // Chọn tuần hiện tại
});

thisMonthBtn.addEventListener("click", () => {
    const startOfMonth = dayjs().startOf("month");
    const endOfMonth = dayjs().endOf("month");
    setDateRange(startOfMonth, endOfMonth);
});

threeDaysAgoBtn.addEventListener("click", () => {
    const startDate = dayjs().subtract(3, "days");
    const endDate = dayjs();  // Ngày kết thúc là hôm nay
    setDateRange(startDate, endDate);
});

fiveDaysAgoBtn.addEventListener("click", () => {
    const startDate = dayjs().subtract(5, "days");
    const endDate = dayjs();  // Ngày kết thúc là hôm nay
    setDateRange(startDate, endDate);
});


lastWeekBtn.addEventListener("click", () => {
    const startOfLastWeek = dayjs().subtract(1, "week").startOf("isoWeek");  // Tuần trước bắt đầu từ Thứ hai
    const endOfLastWeek = dayjs().subtract(1, "week").endOf("isoWeek");  // Tuần trước kết thúc vào Chủ nhật
    setDateRange(startOfLastWeek, endOfLastWeek);  // Chọn tuần trước
});