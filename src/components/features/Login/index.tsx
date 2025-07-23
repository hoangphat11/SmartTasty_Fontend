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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { loginUser } from "@/redux/slices/userSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, user } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const savedLogin = localStorage.getItem("rememberedLogin");
    if (savedLogin) {
      const { email, userPassword } = JSON.parse(savedLogin);
      setEmail(email);
      setUserPassword(userPassword);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      toast.success("Đăng nhập thành công!");
      switch (user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "business":
          router.push("/restaurant");
          break;
        default:
          router.push("/");
      }
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, userPassword, remember }));
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
