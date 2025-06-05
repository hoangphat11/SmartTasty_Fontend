"use client";

import { useState, useEffect } from "react";
import { Button, Popover, Input, Select } from "antd";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./styles.module.scss";
import Image from "next/image";

const { Option } = Select;

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const Header = () => {
  const [localUserName, setLocalUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [showLanguagePopover, setShowLanguagePopover] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(!!token);

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userName = parsedUser?.user?.userName || "User";
        setLocalUserName(userName);
      }
    } catch (error) {
      console.error("Lỗi khi lấy user từ localStorage:", error);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setLocalUserName(null);
    window.location.href = window.location.origin;
  };

  const flagSrc =
    language === "vi"
      ? "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
      : "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg";

  const languageSelectContent = (
    <div
      onClick={() => {
        setLanguage(language === "vi" ? "en" : "vi");
        setShowLanguagePopover(false);
      }}
      style={{ cursor: "pointer" }}
    >
      <Image
        src={
          language === "vi"
            ? "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
            : "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
        }
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
        Xin chào, {localUserName || "User"}
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
        <Link href="/">
          <Image
            src="https://raw.githubusercontent.com/lamlinhh/Travel_Web/refs/heads/vu/assets/Images/logo.webp"
            alt="Logo"
            width={100}
            height={40}
            priority
          />
        </Link>

        <Select
          defaultValue="TP. HCM"
          style={{ width: 120 }}
          variant="borderless"
        >
          <Option value="TP. HCM">TP. HCM</Option>
          <Option value="HN">Hà Nội</Option>
          <Option value="DN">Đà Nẵng</Option>
        </Select>

        <Select
          defaultValue="Ăn uống"
          style={{ width: 120 }}
          variant="borderless"
        >
          <Option value="Ăn uống">Ăn uống</Option>
          <Option value="Cà phê">Cà phê</Option>
        </Select>

        <Input
          placeholder="Địa điểm, món ăn, loại hình..."
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />

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

        <BellOutlined style={{ fontSize: 18, margin: "0 12px" }} />

        <Popover
          content={languageSelectContent}
          open={showLanguagePopover}
          placement="bottomRight"
          trigger="click"
          onOpenChange={(open) => setShowLanguagePopover(open)}
        >
          <div style={{ cursor: "pointer", marginLeft: 8 }}>
            <Image
              src={flagSrc}
              alt={language.toUpperCase()}
              width={24}
              height={16}
            />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
