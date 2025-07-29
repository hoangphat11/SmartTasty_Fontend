"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { Button } from "antd"; // ✅ import AntD Button

const Index = () => {
  const pathname = usePathname();
  const router = useRouter(); // ✅ khai báo router

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>Admin Restaurant</div>
      <ul className={styles.menu}>
        <li className={pathname === "/restaurant" ? styles.active : ""}>
          <Link href="/restaurant">
            <span className={styles.icon}>
              <SpaceDashboardIcon />
            </span>
            Dashboard
          </Link>
        </li>

        <li
          className={`${styles.hasSubmenu} ${
            pathname.startsWith("/admin") ? styles.active : ""
          }`}
        >
          <div className={styles.linkWithHover}>
            <span className={styles.icon}>
              <PersonIcon />
            </span>
            Management
          </div>
          <ul className={styles.submenu}>
            <li>
              <Link href="/products">Quản lý</Link>
            </li>
            <li>
              <Link href="/promotion">Các Ưu Đãi</Link>
            </li>
            <li>
              <Link href="/">Bàn đã đặt</Link>
            </li>
            <li>
              <Link href="/informations">Thông Tin Nhà Hàng</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Index;
