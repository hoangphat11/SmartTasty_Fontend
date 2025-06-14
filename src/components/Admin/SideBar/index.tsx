"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

const Index = () => {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>Admin</div>
      <ul className={styles.menu}>
        <li className={pathname === "/admin" ? styles.active : ""}>
          <Link href="/admin">
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
              <Link href="/admin/users">User</Link>
            </li>
            <li>
              <Link href="/admin/business">Business</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Index;
