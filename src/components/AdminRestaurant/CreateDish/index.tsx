// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axiosInstance from "@/axios/axiosInstance";
// import styles from "./styles.module.scss";
// import { toast } from "react-toastify";
// import dynamic from "next/dynamic";

// export enum DishCategory {
//   Buffet = 0,
//   ThucAn = 1,
//   NuocUong = 2,
//   ThucAnThem = 3,
// }

// const DishCategoryDisplayMap: Record<DishCategory, string> = {
//   [DishCategory.Buffet]: "Buffet",
//   [DishCategory.ThucAn]: "Thức ăn",
//   [DishCategory.NuocUong]: "Nước uống",
//   [DishCategory.ThucAnThem]: "Thức ăn thêm",
// };

// export default function DishForm() {
//   const [form, setForm] = useState({
//     name: "",
//     category: DishCategory.ThucAn,
//     description: "",
//     price: 0,
//     imageUrl: "",
//     isActive: true,
//     restaurantId: 1,
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value, type } = e.target;
//     const newValue =
//       type === "number"
//         ? parseFloat(value)
//         : type === "checkbox"
//         ? (e.target as HTMLInputElement).checked
//         : value;
//     setForm({ ...form, [name]: newValue });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.post("/api/dish", form); // hoặc `http://localhost:5000/api/dish` nếu BE khác domain
//       setMessage("✅ Tạo món ăn thành công!");
//       setForm({
//         name: "",
//         category: DishCategory.ThucAn,
//         description: "",
//         price: 0,
//         imageUrl: "",
//         isActive: true,
//         restaurantId: 1,
//       });
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Tạo món ăn thất bại!");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 max-w-md mx-auto p-4 border rounded shadow"
//     >
//       <h2 className="text-xl font-semibold">Tạo món ăn mới</h2>

//       <div>
//         <label>Tên món ăn:</label>
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full border px-2 py-1 rounded"
//           required
//         />
//       </div>

//       <div>
//         <label>Loại món:</label>
//         <select
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           className="w-full border px-2 py-1 rounded"
//         >
//           {Object.entries(DishCategoryDisplayMap).map(([key, label]) => (
//             <option key={key} value={key}>
//               {label}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label>Mô tả:</label>
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full border px-2 py-1 rounded"
//         />
//       </div>

//       <div>
//         <label>Giá (VNĐ):</label>
//         <input
//           type="number"
//           name="price"
//           value={form.price}
//           onChange={handleChange}
//           className="w-full border px-2 py-1 rounded"
//           required
//         />
//       </div>

//       <div>
//         <label>Image URL:</label>
//         <input
//           type="text"
//           name="imageUrl"
//           value={form.imageUrl}
//           onChange={handleChange}
//           className="w-full border px-2 py-1 rounded"
//           required
//         />
//       </div>

//       <div>
//         <label>Trạng thái:</label>
//         <input
//           type="checkbox"
//           name="isActive"
//           checked={form.isActive}
//           onChange={handleChange}
//         />
//         <span className="ml-2">Đang bán</span>
//       </div>

//       <div>
//         <label>Restaurant ID:</label>
//         <input
//           type="number"
//           name="restaurantId"
//           value={form.restaurantId}
//           onChange={handleChange}
//           className="w-full border px-2 py-1 rounded"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Tạo món
//       </button>

//       {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
//     </form>
//   );
// }
