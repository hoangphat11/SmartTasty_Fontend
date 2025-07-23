"use client";

import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  TextField,
  Typography,
  FormControlLabel,
  Link,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios/axiosInstance";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedLogin = localStorage.getItem("rememberedLogin");
    if (savedLogin) {
      const { email, userPassword } = JSON.parse(savedLogin);
      setEmail(email);
      setUserPassword(userPassword);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const values = { email, userPassword, remember };
      const response = await axiosInstance.post("/api/User/login", values);
      const { errMessage, data } = response.data;

      if (errMessage === "OK" && data?.token && data?.user) {
        dispatch(setUser(data.user));
        document.cookie = `token=${data.token}; path=/; max-age=86400`;

        if (remember) {
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem(
            "rememberedLogin",
            JSON.stringify({ email, userPassword })
          );
        } else {
          localStorage.removeItem("rememberedLogin");
        }

        toast.success("Đăng nhập thành công!");

        switch (data.user.role) {
          case "admin":
            router.push("/admin");
            break;
          case "business":
            router.push("/restaurant");
            break;
          default:
            router.push("/");
        }
      } else {
        toast.error("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard} sx={{ padding: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Đăng nhập
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Mật khẩu"
            variant="outlined"
            fullWidth
            required
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  color="primary"
                />
              }
              label="Lưu đăng nhập"
            />
            <Link
              underline="hover"
              sx={{ cursor: "pointer" }}
              onClick={() => router.push("/forgotPassword")}
            >
              Quên mật khẩu?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </Box>

        <Box className={styles.loginBottom} mt={2} textAlign="center">
          Bạn mới biết đến Smarttasty?{" "}
          <Link
            underline="hover"
            onClick={() => router.push("/register")}
            sx={{ cursor: "pointer" }}
          >
            Đăng ký
          </Link>
        </Box>
      </Card>
    </div>
  );
};

export default LoginPage;
