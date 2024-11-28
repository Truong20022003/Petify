let currentImages = []; // Lưu danh sách ảnh toàn cục

function getAllDisplayedImages() {
  return currentImages;
}

function handleImageUpload(current) {
  currentImages = [...current];
  const maxImages = 10;
  const imageContainer = document.getElementById("image-container");

  document.getElementById("file-input").addEventListener("change", function (event) {
    const files = event.target.files;
    if (currentImages.length + files.length > maxImages) {
      dialogWarning("Bạn chỉ có thể tải lên tối đa 10 ảnh!");
      event.target.value = ""; // Reset input file
      return;
    }

    for (const file of files) {
      const imageUrl = URL.createObjectURL(file);
      currentImages.push(file);
      console.log("Danh sách ảnh hiện tại:", currentImages);

      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("relative", "w-32", "h-32", "m-2", "inline-block");
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
        console.log("Danh sách ảnh sau khi xóa:", currentImages);
      };

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(removeBtn);
      imageContainer.appendChild(imgWrapper);
    }
    event.target.value = ""; // Reset lại input
  });
}
