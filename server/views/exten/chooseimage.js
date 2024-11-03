function handleImageUpload(current) {
  let currentImages = [...current];
  let imageContainer = document.getElementById("image-container");

  // Hàm lấy tất cả các ảnh hiện đang hiển thị
  function getAllDisplayedImages() {
    return currentImages;
  }

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const imgWrapper = btn.parentElement;
      const imgSrc = imgWrapper.getAttribute("data-src");

      // Xóa ảnh khỏi DOM và mảng currentImages
      imgWrapper.remove();
      currentImages = currentImages.filter((src) => src !== imgSrc);
      console.log("Danh sách ảnh sau khi xóa:", currentImages);
    });
  });

  document
    .querySelector("#file-input")
    .addEventListener("change", function (event) {
      const files = event.target.files;

      for (const file of files) {
        const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh mới
        currentImages.push(imageUrl); // Thêm ảnh mới vào mảng
        console.log("Danh sách ảnh hiện tại:", currentImages); // Ghi log mảng ảnh hiện tại

        // Tạo phần tử HTML để hiển thị ảnh mới
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add(
          "relative",
          "w-32",
          "h-32",
          "m-2",
          "inline-block"
        );
        imgWrapper.setAttribute("data-src", imageUrl);

        const img = document.createElement("img");
        img.src = imageUrl;
        img.classList.add("w-full", "h-full", "object-cover", "rounded-md");

        const removeBtn = document.createElement("button");
        removeBtn.innerHTML = "X";
        removeBtn.classList.add("remove-btn");
        removeBtn.onclick = function () {
          imgWrapper.remove();
          currentImages = currentImages.filter((src) => src !== imageUrl);
          console.log("Danh sách ảnh sau khi xóa:", currentImages); // Ghi log mảng sau khi xóa
        };

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(removeBtn);
        imageContainer.appendChild(imgWrapper);
      }
      event.target.value = "";
    });

  // Đặt hàm getAllDisplayedImages vào window để có thể gọi từ nơi khác
  window.getAllDisplayedImages = getAllDisplayedImages;
}

////
function handleImageUploadAdd(selectedFiles) {
  document
    .getElementById("file-input")
    .addEventListener("change", function (event) {
      const imageContainer = document.getElementById("image-container");
      const files = event.target.files;

      for (const file of files) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const imgWrapper = document.createElement("div");
          imgWrapper.classList.add("relative", "w-32", "h-32");

          const img = document.createElement("img");
          img.src = e.target.result;
          img.classList.add(
            "w-full",
            "h-full",
            "object-cover",
            "rounded",
            "shadow-md"
          );

          const removeBtn = document.createElement("button");
          removeBtn.innerHTML = "X";
          removeBtn.classList.add("remove-btn");
          removeBtn.onclick = function () {
            // Xóa ảnh khỏi danh sách hiển thị và mảng selectedFiles
            imageContainer.removeChild(imgWrapper);
            const index = selectedFiles.indexOf(file);
            if (index > -1) {
              selectedFiles.splice(index, 1); // Xóa file khỏi mảng
            }
          };

          imgWrapper.appendChild(img);
          imgWrapper.appendChild(removeBtn);
          imageContainer.appendChild(imgWrapper);
          selectedFiles.push(file); // Lưu file vào danh sách
        };

        reader.readAsDataURL(file);
      }
    });
}
