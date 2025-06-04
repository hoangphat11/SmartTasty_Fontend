"use client";

import { useState, useEffect } from "react";
import { Button, Popover, Input, Select } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { clearUser } from "@/redux/slices/userSide";

const { Option } = Select;

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const Header = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  // State lưu userName lấy từ localStorage
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [showLanguagePopover, setShowLanguagePopover] = useState(false);

  useEffect(() => {
    // Kiểm tra token cookie
    const token = getCookie("token");
    setIsLoggedIn(!!token);

    // Lấy user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.userName) {
          setUserName(userObj.userName);
        }
      } catch (error) {
        console.error("Lỗi parse user trong localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    dispatch(clearUser()); // Xóa user trong redux nếu có
    setIsLoggedIn(false);
    setUserName(null);
    window.location.href = window.location.origin;
  };

  const flagVN =
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg";
  const flagUS =
    "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg";
  const flagSrc = language === "vi" ? flagVN : flagUS;
  const altText = language === "vi" ? "VN" : "EN";

  const languageSelectContent = (
    <div
      onClick={() => {
        setLanguage(language === "vi" ? "en" : "vi");
        setShowLanguagePopover(false);
      }}
      style={{ cursor: "pointer" }}
    >
      <Image
        src={language === "vi" ? flagUS : flagVN}
        alt={language === "vi" ? "EN" : "VN"}
        width={24}
        height={16}
      />
    </div>
  );

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
        Xin chào, {userName || "user"}
      </div>
      <Link href="/account">
        <Button type="text">Tài khoản</Button>
      </Link>
      <Link href="/my-tours">
        <Button type="text">Tour đã đặt</Button>
      </Link>
      <Button type="text" danger onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        {/* Logo */}
        <Link href="/">
          <Image
            src="https://raw.githubusercontent.com/lamlinhh/Travel_Web/refs/heads/vu/assets/Images/logo.webp"
            alt="Logo"
            width={100}
            height={40}
            priority
          />
        </Link>

        {/* Chọn thành phố */}
        <Select defaultValue="TP. HCM" style={{ width: 120 }} bordered={false}>
          <Option value="TP. HCM">TP. HCM</Option>
          <Option value="HN">Hà Nội</Option>
          <Option value="DN">Đà Nẵng</Option>
        </Select>

        {/* Danh mục */}
        <Select defaultValue="Ăn uống" style={{ width: 120 }} bordered={false}>
          <Option value="Ăn uống">Ăn uống</Option>
          <Option value="Cà phê">Cà phê</Option>
        </Select>

        {/* Ô tìm kiếm */}
        <Input
          placeholder="Địa điểm, món ăn, loại hình..."
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />

        {/* Người dùng / Đăng nhập */}
        {isLoggedIn ? (
          <Popover content={userMenu} trigger="click" placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 16,
                cursor: "pointer",
              }}
            >
              <FaUserCircle size={28} />
              <span style={{ marginLeft: 8 }}>{userName}</span>
            </div>
          </Popover>
        ) : (
          <div className={styles.authButtons}>
            <Link href="/login">
              <Button type="text">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button type="text">Đăng Ký</Button>
            </Link>
          </div>
        )}

        {/* Thông báo */}
        <BellOutlined style={{ fontSize: 18, margin: "0 12px" }} />

        {/* Lá cờ chọn ngôn ngữ */}
        <Popover
          content={languageSelectContent}
          visible={showLanguagePopover}
          placement="bottomRight"
          trigger="click"
          onVisibleChange={(visible) => setShowLanguagePopover(visible)}
        >
          <div style={{ cursor: "pointer", marginLeft: 8 }}>
            <Image src={flagSrc} alt={altText} width={24} height={16} />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
