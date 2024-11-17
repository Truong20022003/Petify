function toggleSubmenu() {
  const submenu = document.getElementById("submenuItems");
  const icon = document.getElementById("manageIcon");

  // Toggle the submenu's visibility
  submenu.classList.toggle("submenu-active");

  // Change the icon based on visibility
  if (submenu.classList.contains("submenu-active")) {
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  } else {
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  }
}
function toggleUserSubmenu() {
  const submenu = document.getElementById("userSubmenuItems");
  const icon = document.getElementById("userManageIcon");
  submenu.classList.toggle("submenu-active");
  icon.classList.toggle("fa-chevron-down");
  icon.classList.toggle("fa-chevron-up");
}
function activateSubmenu(element) {
  const links = document.querySelectorAll(".submenu a");
  links.forEach((link) => {
    link.classList.remove("active");
  });
  element.classList.add("active");
}
////
document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInUserAvatar = localStorage.getItem("loggedInUserAvatar");

  if (loggedInUser && loggedInUserAvatar) {
    document.getElementById("nameuser").textContent =
      "Welcome, " + loggedInUser;
    document.getElementById("userAvatar").src = loggedInUserAvatar;
  } else {
    document.getElementById("nameuser").textContent =
      "Bạn đã đăng nhập tài khoản chưa?";
    document.getElementById("userAvatar").src =
      "https://th.bing.com/th/id/OIP.jEnS4Sc5lFbgXkY0Y1jTpwAAAA?rs=1&pid=ImgDetMain";
  }
});
////
function logout() {
  // Xóa thông tin người dùng khỏi localStorage khi đăng xuất
  const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất không?");

  if (userConfirmed) {
    // Nếu người dùng chọn "OK", thực hiện đăng xuất
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserAvatar");
    localStorage.removeItem("loggedInUserRole");
    // Chuyển hướng đến trang đăng nhập (hoặc trang khác)
    window.location.href = "/views/Login/LoginScreen.html";
  }
}
function checkAdminAccess() {
  const userRole = localStorage.getItem('loggedInUserRole'); // Lấy thông tin role từ localStorage
  const userManagementMenu = document.getElementById('manageMenu'); // Menu quản lý người dùng

  if (userRole !== 'admin') {
    userManagementMenu.style.display = 'none';
  } else {
    userManagementMenu.style.display = 'block';
  }
}
window.onload = function () {
  checkAdminAccess();
}

///
// window.onpopstate = function () {
//   // Kiểm tra nếu người dùng đã đăng xuất (không có thông tin người dùng)
//   if (!localStorage.getItem("loggedInUser")) {
//     // Đưa người dùng đến trang đăng nhập và chặn nút Back
//     window.location.replace("/views/Login/LoginScreen.html");
//   } else {
//     // Nếu vẫn còn đăng nhập, giữ nguyên trạng thái
//     history.pushState(null, null, location.href);
//   }
// };

// // Thêm sự kiện load để xóa cache của trang nhằm chặn nút Back trên một số trình duyệt
// window.onload = function () {
//   if (!localStorage.getItem("loggedInUser")) {
//     // Ngăn trình duyệt lưu cache
//     window.location.replace("/views/Login/LoginScreen.html");
//   }
// };
// history.pushState(null, null, location.href);
// window.onpopstate = function () {
//   history.pushState(null, null, location.href);
// };
