"use client";

import { useState, useEffect } from "react";
import { Button, Popover, Input, Select } from "antd";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import styles from "./styles.module.scss";
import { getImageUrl } from "@/constants/config/imageBaseUrl";
import LanguageSelector from "@/components/layouts/LanguageSelector";
import ThemeToggleButton from "@/components/layouts/ThemeToggleButton";

const { Option } = Select;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const Header = () => {
  const [localUserName, setLocalUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Tránh lỗi hydration
    setHydrated(true);

    const token = getCookie("token");
    setIsLoggedIn(!!token);

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userName = parsedUser?.user?.userName || "User";
        setLocalUserName(userName);
      }
    } catch (err) {
      console.error("Lỗi khi lấy user từ localStorage:", err);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
    setLocalUserName(null);
    window.location.href = "/login";
  };

  const userMenu = (
    <div className={styles.popoverMenu}>
      <div
        style={{
          padding: "8px 16px",
          fontWeight: "600",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 8,
        }}
      >
        Xin chào, {localUserName || "User"}
      </div>
      <Link href="/account">
        <Button type="text" block>
          Tài khoản
        </Button>
      </Link>
      <Button type="text" danger block onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  );

  if (!hydrated) return null;

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        {/* Logo */}
        <Link href="/">
          <Image
            src={getImageUrl("Logo/anhdaidien.png")}
            alt="Logo"
            width={64}
            height={40}
            priority
          />
        </Link>

        {/* Khu vực */}
        <Select
          defaultValue="TP. HCM"
          style={{ width: 120 }}
          variant="borderless"
        >
          <Option value="TP. HCM">TP. HCM</Option>
          <Option value="HN">Hà Nội</Option>
          <Option value="DN">Đà Nẵng</Option>
        </Select>

        {/* Danh mục */}
        <Select
          defaultValue="Danh Mục "
          style={{ width: 120 }}
          variant="borderless"
        >
          <Option value="Buffet">Buffet</Option>
          <Option value="NhaHang">Nhà Hàng</Option>
          <Option value="AnVatViaHe">Ăn vặt/vỉa hè</Option>
          <Option value="AnChay">Ăn chay</Option>
          <Option value="CafeNuocuong">Cafe/Nuocuong</Option>
          <Option value="QuanAn">Quán ăn</Option>
          <Option value="Bar">Bar</Option>
          <Option value="QuanNhau">Quán nhậu</Option>
        </Select>

        {/* Tìm kiếm */}
        <Input
          placeholder="Địa điểm, món ăn, loại hình..."
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />

        {/* Đăng nhập/Đăng xuất */}
        {isLoggedIn ? (
          <Popover content={userMenu} trigger="click" placement="bottomRight">
            <div style={{ marginLeft: 16, cursor: "pointer" }}>
              <FaUserCircle size={28} />
            </div>
          </Popover>
        ) : (
          <div className={styles.authButtons}>
            <Link href="/login">
              <Button type="text">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button type="text">Đăng ký</Button>
            </Link>
          </div>
        )}

        {/* Thông báo */}
        <BellOutlined style={{ fontSize: 18, margin: "0 12px" }} />

        <LanguageSelector />
        <ThemeToggleButton />
      </div>
    </div>
  );
};

export default Header;
