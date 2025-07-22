"use client";

import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import moment from "moment";
import { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios/axiosInstance";
import { User } from "@/types/user";
import UserModal from "@/Model/UserModel";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/User"); // đổi endpoint nếu backend khác
      const allUsers: User[] = res.data.data || [];
      const filteredUsers = allUsers.filter((user) => user.role === "user");
      setUsers(filteredUsers);
      console.log("abc", filteredUsers);
    } catch (error) {
      console.log("loi", error);
      toast.error("Không thể lấy danh sách người dùng!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    try {
      await axiosInstance.delete(`/api/User/${userId}`);
      toast.success("Xoá thành công!");
      fetchUsers();
    } catch (error) {
      toast.error("Xoá thất bại!");
      console.log("abc:", userId);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "",
      key: "action",
      align: "center",
      width: 30,
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa user này?"
          onConfirm={() => handleDelete(record.userId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer", fontSize: "20px" }}
          />
        </Popconfirm>
      ),
    },
    {
      title: "UserName",
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar>{text.charAt(0).toUpperCase()}</Avatar>
          <span style={{ marginLeft: 8 }}>{text}</span>
        </div>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    { title: "Phone", dataIndex: "phone", key: "phone", align: "center" },
    { title: "Role", dataIndex: "role", key: "role", align: "center" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date: string) => moment(date).format("DD/MM/YYYY"),
    },
  ];

  const filteredData = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <UserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchUsers}
      />
      <span>Thông Tin User</span>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Input
          placeholder="Search user..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 250 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenModal(true)}
        >
          Thêm
        </Button>
      </div>
      <Table
        bordered
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 6 }}
        rowKey="userId"
      />
    </div>
  );
};

export default UserPage;
