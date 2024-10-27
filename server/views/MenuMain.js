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
      "Welcome, " + loggedInUser ;
    document.getElementById("userAvatar").src = loggedInUserAvatar;
  }
});
