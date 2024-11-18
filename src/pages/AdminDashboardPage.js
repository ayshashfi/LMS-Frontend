import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Alert } from "@mui/lab";

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await axios.get("http://localhost:8000/api/accounts/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Ensure admins are excluded by checking `is_admin` or equivalent field
      const filteredUsers = response.data.filter((user) => !user.is_admin);
  
      setUsers(filteredUsers);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Failed to fetch users");
      setLoading(false);
    }
  };
  

  // Block or unblock a user
  const handleBlockUnblock = async (userId, currentStatus) => {
    const token = localStorage.getItem("access_token"); // Get the token

    try {
      await axios.patch(`http://localhost:8000/api/accounts/users/${userId}/block-unblock/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      });

      // Refetch users after blocking/unblocking
      fetchUsers();
      setSnackbarMessage(currentStatus ? "User Blocked" : "User Unblocked");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Failed to block/unblock user", err);
      setError("Failed to update user status");
    }
  };

  // Use useEffect to fetch the list of users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('designation');

    // Redirect to login
    window.location.replace('/login');

    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
        window.history.pushState(null, '', window.location.href);
    };
};


  // Sidebar component
  const Sidebar = () => (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <Box sx={{ width: 240, bgcolor: "primary.main", color: "white", height: "100%" }}>
        <Toolbar />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h6" component="div">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Admin Dashboard
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.designation}</TableCell>
                    <TableCell>{user.department_name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={user.is_active ? "success" : "error"}
                        onClick={() => handleBlockUnblock(user.id, user.is_active)}
                      >
                        {user.is_active ? "Active" : "Blocked"}
                      </Button>
                    </TableCell>
                
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
