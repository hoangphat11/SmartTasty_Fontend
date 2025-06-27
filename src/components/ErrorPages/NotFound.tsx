import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h1>404 - Không tìm thấy trang</h1>
      <p>Trang bạn đang tìm không tồn tại hoặc đã bị xoá.</p>
      <Link href="/" style={{ color: "#1677ff" }}>
        ← Quay về trang chủ
      </Link>
    </div>
  );
}
