"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { toast } from "react-toastify";
import moment from "moment";
import axiosInstance from "@/lib/axios/axiosInstance";
import { User } from "@/types/user";
import { Restaurant } from "@/types/restaurant";
import styles from "./styles.module.scss";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [businessUsers, setBusinessUsers] = useState<User[]>([]);
  const [normalUsers, setNormalUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/User");
      const allUsers: User[] = res.data?.data || [];
      setUsers(allUsers);
      setBusinessUsers(allUsers.filter((u) => u.role === "business"));
      setNormalUsers(allUsers.filter((u) => u.role === "user"));
      console.log("Users:", allUsers); // ✅ Debug
      return allUsers;
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách Users!");
      return [];
    }
  };

  // Fetch Restaurants
  const fetchRestaurants = async () => {
    try {
      const res = await axiosInstance.get("/api/Restaurant");
      const data = res.data?.data;
      const safeData = Array.isArray(data) ? data : data?.items || [];
      setRestaurants(safeData);
      console.log("Restaurants:", safeData); // ✅ Debug
      return safeData;
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách nhà hàng!");
      setRestaurants([]);
      return [];
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchRestaurants()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const getChartData = (list: { createdAt?: string }[] | undefined | null) => {
    if (!Array.isArray(list)) return {};
    return list.reduce((acc: Record<string, number>, item) => {
      if (!item.createdAt) return acc;
      const date = moment(item.createdAt).format("MM/YYYY");
      acc[date] = acc[date] ? acc[date] + 1 : 1;
      return acc;
    }, {});
  };

  const userChartData = getChartData(normalUsers);
  const businessChartData = getChartData(businessUsers);
  const restaurantChartData = getChartData(restaurants);

  const chartOptions = (categories: string[]) => ({
    chart: { id: "chart" },
    xaxis: { categories },
  });

  if (loading) {
    return (
      <Box
        className={styles.dashboard}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={styles.dashboard}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Tổng quan người dùng & nhà hàng
      </Typography>

      <Grid container spacing={3} className={styles.cards}>
        <Grid item xs={12} md={4}>
          <Paper className={styles.card} elevation={3} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body1">Tổng User thường</Typography>
                <Typography variant="h5" fontWeight={500}>
                  {normalUsers.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={styles.card} elevation={3} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: "#d32f2f", mr: 2 }}>
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="body1">Tổng User Business</Typography>
                <Typography variant="h5" fontWeight={500}>
                  {businessUsers.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={styles.card} elevation={3} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: "#388e3c", mr: 2 }}>
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="body1">Tổng nhà hàng</Typography>
                <Typography variant="h5" fontWeight={500}>
                  {restaurants.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3} className={styles.charts}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              User thường theo tháng
            </Typography>
            <Chart
              options={chartOptions(Object.keys(userChartData))}
              series={[{ name: "Users", data: Object.values(userChartData) }]}
              type="bar"
              width="100%"
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              User Business theo tháng
            </Typography>
            <Chart
              options={chartOptions(Object.keys(businessChartData))}
              series={[
                { name: "Business", data: Object.values(businessChartData) },
              ]}
              type="bar"
              width="100%"
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Nhà hàng theo tháng
            </Typography>
            <Chart
              options={chartOptions(Object.keys(restaurantChartData))}
              series={[
                { name: "Nhà hàng", data: Object.values(restaurantChartData) },
              ]}
              type="bar"
              width="100%"
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
