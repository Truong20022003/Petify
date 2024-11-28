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
const dialogSuccess = (title) => {
    return  Swal.fire({
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



 