"use client";

import { useEffect, useState } from "react";
import { Card, Avatar, Typography } from "antd";
import { User } from "@/types/user";
import axiosInstance from "@/axios/axiosInstance";
import styles from "./styles.module.scss";
import dynamic from "next/dynamic";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { toast } from "react-toastify";
import moment from "moment";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const { Title } = Typography;

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [businessUsers, setBusinessUsers] = useState<User[]>([]);
  const [normalUsers, setNormalUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/User");
      const allUsers: User[] = res.data.data || [];
      const businesses = allUsers.filter((user) => user.role === "business");
      const users = allUsers.filter((user) => user.role === "user");
      setUsers(allUsers);
      setBusinessUsers(businesses);
      setNormalUsers(users);
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách Users!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getChartData = (userList: User[]) => {
    return userList.reduce((acc: any, user: User) => {
      const date = moment(user.createdAt).format("MM/YYYY");
      acc[date] = acc[date] ? acc[date] + 1 : 1;
      return acc;
    }, {});
  };

  const userChartData = getChartData(normalUsers);
  const businessChartData = getChartData(businessUsers);

  const chartOptions = (categories: string[]) => ({
    chart: { id: "chart" },
    xaxis: {
      categories,
    },
  });

  return (
    <div className={styles.dashboard}>
      <Title level={2}>Tổng quan người dùng</Title>

      <div className={styles.cards}>
        <Card className={styles.card} bordered>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar size="large" icon={<PersonIcon />} />
            <div style={{ marginLeft: 12 }}>
              <div>Tổng User thường</div>
              <Title level={4}>{normalUsers.length}</Title>
            </div>
          </div>
        </Card>
        <Card className={styles.card} bordered>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar size="large" icon={<BusinessIcon />} />
            <div style={{ marginLeft: 12 }}>
              <div>Tổng User Business</div>
              <Title level={4}>{businessUsers.length}</Title>
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.charts}>
        <Card title="User thường theo tháng">
          <Chart
            options={chartOptions(Object.keys(userChartData))}
            series={[{ name: "Users", data: Object.values(userChartData) }]}
            type="bar"
            width="100%"
            height={300}
          />
        </Card>
        <Card title="User Business theo tháng">
          <Chart
            options={chartOptions(Object.keys(businessChartData))}
            series={[{ name: "Business", data: Object.values(businessChartData) }]}
            type="bar"
            width="100%"
            height={300}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
