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
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var emailError = document.getElementById("emailError");
    var passwordError = document.getElementById("passwordError");
    var isValid = true;

    if (email.value.trim() === "") {
      email.classList.add("error-border");
      emailError.classList.remove("hidden");
      email.focus();
      isValid = false;
    } else {
      email.classList.remove("error-border");
      emailError.classList.add("hidden");
    }

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

    if (isValid) {
      fetch("http://localhost:3000/user/getListUser",{
        method: "GET",
        headers: {
          "Authorization": "trinh_nhung" // replace with your actual token if needed
      }
      })
        .then((response) => response.json())
        .then((data) => {
          console.table(data);
          if (
            data.some(
              (dt) =>
                dt.email === email.value ||
                (dt.user_name === email.value && dt.password === password.value)
            )
          ) {
            alert("dang nhap thanh cong");
            const user = data.find(
              (dt) =>
                (dt.email === email.value || dt.user_name === email.value) &&
                dt.password === password.value
            );
            localStorage.setItem("loggedInUser", user.name);
            localStorage.setItem("loggedInUserAvatar", user.avata);
            console.log(`${user.name},hihih,   ${user.avata}`);
            window.location.href = "/views/Home/HomeScreen.html";
          } else {
            alert("ban nhap sai tai khoan hoac mat khau");
          }
        })
        .catch((error) => console.error(error));
    }
  });
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
