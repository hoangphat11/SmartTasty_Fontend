"use client";

import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios/axiosInstance";
import axios from "axios";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

const RegisterBusiness = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    userName: "",
    userPassword: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formValues.userName)
      newErrors.userName = "Vui lòng nhập tên người dùng!";
    if (!formValues.userPassword) {
      newErrors.userPassword = "Vui lòng nhập mật khẩu!";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(
        formValues.userPassword
      )
    ) {
      newErrors.userPassword =
        "Mật khẩu phải chứa chữ hoa, chữ thường, số, ký tự đặc biệt và dài hơn 5 ký tự.";
    }

    if (!formValues.email) {
      newErrors.email = "Vui lòng nhập Email!";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formValues.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formValues.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại!";
    } else if (!/^(03|05|07|08|09)\d{8}$/.test(formValues.phone)) {
      newErrors.phone =
        "Số điện thoại không hợp lệ (phải là số Việt Nam bắt đầu bằng 03, 05, 07, 08, 09 và có 10 chữ số).";
    }

    if (!formValues.address) newErrors.address = "Vui lòng nhập địa chỉ!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/User", {
        ...formValues,
        Role: "business",
      });

      const { errCode, errMessage } = response.data;

      if (errCode === 0) {
        toast.success(errMessage || "Đăng ký thành công!");
        router.push("/");
      } else {
        toast.error(errMessage || "Đăng ký thất bại!");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.errMessage) {
        toast.error(error.response.data.errMessage);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <Card className={styles.registerCard} sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Đăng ký Doanh Nghiệp
        </Typography>

        <Box
          component="form"
          onSubmit={handleRegister}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Tài khoản"
            name="userName"
            value={formValues.userName}
            onChange={handleChange}
            error={!!errors.userName}
            helperText={errors.userName}
            fullWidth
          />

          <TextField
            label="Mật khẩu"
            type="password"
            name="userPassword"
            value={formValues.userPassword}
            onChange={handleChange}
            error={!!errors.userPassword}
            helperText={errors.userPassword}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Số điện thoại"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />

          <TextField
            label="Địa chỉ"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
          />

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
              "Đăng ký"
            )}
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default RegisterBusiness;
