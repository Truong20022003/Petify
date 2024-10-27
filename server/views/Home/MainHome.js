// const content = document.querySelector(".content");
// let url = "http://localhost:3000/product/getListProduct";
// let tbody = document.querySelector("tbody");
// fetch(url)
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     tbody.innerHTML = data
//       .map(
//         (item, index) => `<tr>
//                 <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
//                 <td class="border border-gray-300 px-4 py-2">${item._id}</td>
//                 <td class="border border-gray-300 px-4 py-2">${item.name}</td> 
//                 <td class="border border-gray-300 px-4 py-2">${item.price}</td>
//                 <td class="border border-gray-300 px-4 py-2">${item.status}</td>
//                 <td class="border border-gray-300 px-4 py-2">${item.date}</td>
//                 <td class="border border-gray-300 px-4 py-2">
//                   <img
//                     alt="Product image"
//                     class="w-12 h-12"
//                     height="50"
//                     src="${item.image[0]}"
//                     width="50"
//                   />
//                 </td>
//                 <td class="border border-gray-300 px-4 py-2">
//                   <div class="button-group flex flex-col space-y-2">
//                     <button class="bg-blue-500 text-white px-2 py-1 rounded">
//                       Cập nhật
//                     </button>
//                     <button class="bg-red-500 text-white px-2 py-1 rounded">
//                       Xóa
//                     </button>
//                     <button class="bg-yellow-500 text-white px-2 py-1 rounded">
//                       Chi tiết
//                     </button>
//                   </div>
//                 </td>
//               </tr>`
//       )
//       .join("");
//   });
