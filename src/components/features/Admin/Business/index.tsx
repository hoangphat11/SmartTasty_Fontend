"use client";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios/axiosInstance";
import { User } from "@/types/user";
import styles from "./styles.module.scss";

interface ExtendedUser extends User {
  restaurants?: string;
}

const UserPage = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const fetchUsers = async () => {
    try {
      const [userRes, restaurantRes] = await Promise.all([
        axiosInstance.get("/api/User"),
        axiosInstance.get("/api/Restaurant"),
      ]);

      const allUsers: User[] = userRes.data.data || [];
      const allRestaurants: any[] = restaurantRes.data.data || [];

      const businessUsers = allUsers
        .filter((user) => user.role === "business")
        .map((user) => {
          const userRestaurants = allRestaurants
            .filter((r) => r.ownerId === user.userId)
            .map((r) => r.name)
            .join(", ");
          return { ...user, restaurants: userRestaurants };
        });

      setUsers(businessUsers);
    } catch (error) {
      toast.error("Không thể lấy danh sách người dùng hoặc nhà hàng!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      await axiosInstance.delete(`/api/User/${selectedUserId}`);
      toast.success("Xoá thành công!");
      fetchUsers();
      setOpenDialog(false);
    } catch (error) {
      toast.error("Xoá thất bại!");
    }
  };

  const filteredData = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box className={styles.container}>
      <Typography className={styles.header}>Danh sách Business User</Typography>

      <Box className={styles.searchBox}>
        <TextField
          label="Tìm kiếm người dùng"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Xoá</TableCell>
              <TableCell>UserName</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Nhà hàng</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user) => (
              <TableRow key={user.userId}>
                <TableCell align="center">
                  <Tooltip title="Xoá người dùng">
                    <IconButton
                      onClick={() => {
                        setSelectedUserId(user.userId);
                        setOpenDialog(true);
                      }}
                      className={styles.deleteBtn}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box className={styles.avatarCell}>
                    <Avatar>{user.userName.charAt(0).toUpperCase()}</Avatar>
                    <Typography className={styles.name}>
                      {user.userName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.phone}</TableCell>
                <TableCell align="center">{user.role}</TableCell>
                <TableCell align="center">
                  {user.restaurants || "Chưa có"}
                </TableCell>
                <TableCell align="center">
                  {moment(user.createdAt).format("DD/MM/YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá người dùng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Huỷ</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
