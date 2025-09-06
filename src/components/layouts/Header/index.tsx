"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  Popover,
  TextField,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles.module.scss";
import { FaUserCircle } from "react-icons/fa";
import { getImageUrl } from "@/constants/config/imageBaseUrl";
import LanguageSelector from "@/components/layouts/LanguageSelector";
import ThemeToggleButton from "@/components/layouts/ThemeToggleButton";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const Header = () => {
  const [localUserName, setLocalUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setHydrated(true);

    const token = getCookie("token");
    setIsLoggedIn(!!token);

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // const userName = parsedUser?.user?.userName || "User";
        const userName = parsedUser?.userName || "User";

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

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (!hydrated) return null;

  return (
    <Box sx={{ p: 2, bgcolor: "background.paper", boxShadow: 1 }}>
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left: Logo */}
        <Link href="/">
          <Image
            src={getImageUrl("Logo/anhdaidien.png")}
            alt="Logo"
            width={64}
            height={40}
            priority
          />
        </Link>

        {/* Middle: Filter + Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <TextField
            select
            defaultValue="TP. HCM"
            size="small"
            variant="standard"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="TP. HCM">TP. HCM</MenuItem>
            <MenuItem value="HN">Hà Nội</MenuItem>
            <MenuItem value="DN">Đà Nẵng</MenuItem>
          </TextField>

          <TextField
            select
            defaultValue="Buffet"
            size="small"
            variant="standard"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="Buffet">Buffet</MenuItem>
            <MenuItem value="NhaHang">Nhà Hàng</MenuItem>
            <MenuItem value="AnVatViaHe">Ăn vặt/vỉa hè</MenuItem>
            <MenuItem value="AnChay">Ăn chay</MenuItem>
            <MenuItem value="CafeNuocuong">Cafe/Nước uống</MenuItem>
            <MenuItem value="QuanAn">Quán ăn</MenuItem>
            <MenuItem value="Bar">Bar</MenuItem>
            <MenuItem value="QuanNhau">Quán nhậu</MenuItem>
          </TextField>

          <TextField
            size="small"
            variant="outlined"
            placeholder="Địa điểm, món ăn, loại hình..."
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
            sx={{ width: 300, maxWidth: "100%" }}
          />
        </Box>

        {/* Right: Auth, Notification, Language, Theme */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isLoggedIn ? (
            <>
              <IconButton onClick={handlePopoverOpen}>
                <FaUserCircle size={24} />
              </IconButton>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Box sx={{ p: 2, minWidth: 200 }}>
                  <Typography fontWeight={600} mb={1}>
                    Xin chào, {localUserName}
                  </Typography>
                  <Link href="/account">
                    <Button fullWidth size="small" variant="text">
                      Tài khoản
                    </Button>
                  </Link>
                  <Button
                    fullWidth
                    size="small"
                    variant="text"
                    color="error"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </Box>
              </Popover>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="small" variant="text">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="small" variant="text">
                  Đăng ký
                </Button>
              </Link>
            </>
          )}

          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>

          <LanguageSelector />
          <ThemeToggleButton />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
