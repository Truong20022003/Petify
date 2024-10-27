 function handleImageUpload(current) {
    let currentImages = [...current];
    let imageContainer = document.getElementById("image-container");
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
          const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the new image
          currentImages.push(imageUrl); // Add the new image to the array
          console.log("Danh sách ảnh hiện tại:", currentImages); // Log the current images array
  
          // Create HTML element to display the new image
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
            console.log("Danh sách ảnh sau khi xóa:", currentImages); // Log the images array after deletion
          };
  
          imgWrapper.appendChild(img);
          imgWrapper.appendChild(removeBtn);
          imageContainer.appendChild(imgWrapper);
        }
        event.target.value = "";
      });
  }
  