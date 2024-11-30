

// Hàm lấy danh sách ảnh hiện tại
function getAllDisplayedImages() {
  console.log("Danh sách ảnh hiện tại:", currentImages);
  return currentImages;
}
// Hàm xử lý upload ảnh
function handleImageUpload(current) {
  const maxImages = 10;
  const imageContainer = document.getElementById("image-container");

  // Cập nhật currentImages từ danh sách ban đầu (nếu có)
  current.forEach(imageUrl => {
    // Kiểm tra ảnh đã có trong currentImages chưa
    if (!currentImages.some(img => img.url === imageUrl)) {
      currentImages.push({ file: null, url: imageUrl });
    }
  });

  document.getElementById("file-input").addEventListener("change", function (event) {
    const files = event.target.files;

    if (currentImages.length + files.length > maxImages) {
      dialogWarning("Bạn chỉ có thể tải lên tối đa 10 ảnh!");
      event.target.value = ""; // Reset input file
      return;
    }

    Array.from(files).forEach(file => {
      const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
      if (!validExtensions.includes(file.type)) {
        dialogWarning("Vui lòng chỉ chọn ảnh có đuôi jpg, jpeg, png!");
        return;
      }
      const imageUrl = URL.createObjectURL(file); // Tạo URL tạm cho ảnh

      // Lưu ảnh vào mảng dưới dạng đối tượng
      currentImages.push({ file, url: imageUrl });

      // Render ảnh vào giao diện
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("relative", "w-32", "h-32", "m-2", "inline-block");
      imgWrapper.setAttribute("data-src", imageUrl); // Đánh dấu URL

      const img = document.createElement("img");
      img.src = imageUrl;
      img.classList.add("w-full", "h-full", "object-cover", "rounded-md");

      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = "X";
      removeBtn.classList.add("remove-btn");

      removeBtn.onclick = function () {
        removeImage(imageUrl); // Gọi hàm xóa ảnh
      };

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(removeBtn);
      imageContainer.appendChild(imgWrapper);
    });

    event.target.value = ""; // Reset lại input
  });
}


// Hàm xóa ảnh khỏi DOM và mảng currentImages
function removeImage(imageUrl) {
  // Lọc bỏ ảnh có URL khớp với imageUrl
  currentImages = currentImages.filter(item => item.url !== imageUrl);

  // Xóa ảnh khỏi giao diện
  const imageWrapper = document.querySelector(`[data-src="${imageUrl}"]`);
  if (imageWrapper) {
    imageWrapper.remove();
  }

  console.log("Danh sách ảnh sau khi xóa:", currentImages);
}

