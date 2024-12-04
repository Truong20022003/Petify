const headers = {
  Authorization: "trinh_nhung", // thay bằng token thực tế nếu cần
};
function swapImages(image1, image2) {
  var tempSrc = image1.src;
  image1.src = image2.src;
  image2.src = tempSrc;

  var tempAlt = image1.alt;
  image1.alt = image2.alt;
  image2.alt = tempAlt;

  image1.classList.add("transition");
  image2.classList.add("transition");

  image1.classList.add("animate__animated", "animate__fadeIn");
  image2.classList.add("animate__animated", "animate__fadeIn");
}

document
  .getElementById("thumbnailImage1")
  .addEventListener("click", function () {
    swapImages(
      document.getElementById("mainImage"),
      document.getElementById("thumbnailImage1")
    );
  });

document
  .getElementById("thumbnailImage2")
  .addEventListener("click", function () {
    swapImages(
      document.getElementById("mainImage"),
      document.getElementById("thumbnailImage2")
    );
  });
document
  .getElementById("thumbnailImage3")
  .addEventListener("click", function () {
    swapImages(
      document.getElementById("mainImage"),
      document.getElementById("thumbnailImage3")
    );
  });
document
  .getElementById("thumbnailImage4")
  .addEventListener("click", function () {
    swapImages(
      document.getElementById("mainImage"),
      document.getElementById("thumbnailImage4")
    );
  });
document
  .getElementById("thumbnailImage5")
  .addEventListener("click", function () {
    swapImages(
      document.getElementById("mainImage"),
      document.getElementById("thumbnailImage5")
    );
  });
document
  .querySelector(".toggle-password")
  .addEventListener("click", function () {
    var passwordInput = document.getElementById("password");
    var type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var emailError = document.getElementById("emailError");
    var passwordError = document.getElementById("passwordError");
    var isValid = true;
    console.log(email.value, "email", password.value, "password")
    // Kiểm tra email
    if (email.value.trim() === "") {
      email.classList.add("error-border");
      emailError.classList.remove("hidden");
      email.focus();
      isValid = false;
    } else {
      email.classList.remove("error-border");
      emailError.classList.add("hidden");
    }

    // Kiểm tra mật khẩu
    if (password.value.trim() === "") {
      password.classList.add("error-border");
      passwordError.classList.remove("hidden");
      if (isValid) {
        password.focus();
      }
      isValid = false;
    } else {
      password.classList.remove("error-border");
      passwordError.classList.add("hidden");
    }

    // Nếu email và mật khẩu hợp lệ, thực hiện login
    if (isValid) {
      try {
        // Gửi yêu cầu GET để lấy danh sách người dùng
        const response = await fetch("http://localhost:3000/user/getListUser", {
          method: "GET",
          headers,
        });

        const data = await response.json(); // Chuyển đổi dữ liệu nhận được thành JSON

        console.table(data); // Log ra để kiểm tra

        // Kiểm tra nếu có người dùng khớp với email và mật khẩu
        const user = data.find(
          (dt) =>
            (dt.email === email.value || dt.user_name === email.value) &&
            dt.password === password.value
        );
        console.log(user, "heeh")
        if (user) {
          // Lấy vai trò người dùng
          const roles = await getAllUsersWithRoles(user._id);
          console.log(roles, "checkuRole");

          // Kiểm tra vai trò người dùng
          const userRole = roles.some(
            (role) =>
              role._id === "672f2c435367fbd3bf9f6831" ||
              role._id === "672f6ea15367fbd3bf9f69ff"
          );
          console.log(userRole, "userRole");
          if (userRole) {
            localStorage.setItem("loggedInUser", user.name);
            localStorage.setItem("loggedInUserAvatar", user.avata);
            const roleAdmin = roles.some(
              (role) => role._id === "672f2c435367fbd3bf9f6831"
            );
            if (roleAdmin) {
              localStorage.setItem("loggedInUserRole", "admin");
            } else {
              localStorage.setItem("loggedInUserRole", "");
            }
            console.log(roleAdmin, "roleAdmin");

            console.log(`${user.name}, ${user.avata}`);
            // alert("Đăng nhập thành công");
            dialogSuccessLogin("Đăng nhập thành công", "/views/Home/HomeScreen.html")
          } else {
            dialogWarning("Xin lỗi!", "Bạn không có quyền truy cập")
          }
        } else {
          dialogError("Xin lỗi!", "Bạn nhập sai tài khoản hoặc mật khẩu")
        }
      } catch (error) {
        console.error("Lỗi khi đăng nhập:", error); // Xử lý lỗi nếu có
      }
    }
  });
///
async function getUserRole() {
  // console.log(id, "user");
  try {
    const response = await fetch(
      `http://localhost:3000/userRole/getListUserRole`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return "";
  }
}
////
async function getAllUsersWithRoles(id) {
  // console.log(id, "user");
  try {
    const response = await fetch(
      `http://localhost:3000/userRole/getAllUsersWithRoles`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();
    // console.log(data.result, "InvoiceDetail");
    const userRole = data.result.find((userRole) => userRole.user._id === id);
    if (userRole) {
      // console.log(userRole.roles, "Tên người dùng");
      return userRole.roles;
    } else {
      console.log("User không tồn tại");
      return [];
    }
  } catch (err) {
    console.log(err);
    return "";
  }
}
/////next image
const thumbnailImages = [
  document.getElementById("thumbnailImage1"),
  document.getElementById("thumbnailImage2"),
  document.getElementById("thumbnailImage3"),
  document.getElementById("thumbnailImage4"),
];

let currentImageIndex = 0;

function autoSwapImages() {
  currentImageIndex = (currentImageIndex + 1) % thumbnailImages.length;
  swapImages(
    document.getElementById("mainImage"),
    thumbnailImages[currentImageIndex]
  );
}
setInterval(autoSwapImages, 3000);
/////
