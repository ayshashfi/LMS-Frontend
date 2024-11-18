
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  CircularProgress,
  Typography,
  Snackbar,
  Box,
  TableCell,TableBody,Paper,Table,TableContainer,TableHead,TableRow
} from "@mui/material";
import { Alert } from "@mui/lab";
import Sidebar from "../api/Componenets/empsidebar";
import Navbar from "../api/Componenets/empnavbar";


const EmployeeDashboardPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [remainingLeaves, setRemainingLeaves] = useState(30); // Track remaining leave balance
  const navigate = useNavigate();

  // Fetch leave requests and update remaining leaves
  const fetchLeaveRequests = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        "http://localhost:8000/api/leave/list", 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeaveRequests(response.data);
      setLoading(false);

      // Calculate remaining leaves by deducting approved leaves from 30
      let usedLeaves = 0;
      response.data.forEach((request) => {
        if (request.status === "Approved") {
          const startDate = new Date(request.start_date);
          const endDate = new Date(request.end_date);
          const diffInTime = endDate - startDate;
          const diffInDays = diffInTime / (1000 * 3600 * 24); // Calculate days between start and end date
          usedLeaves += diffInDays + 1; // +1 to include the start date
        }
      });

      setRemainingLeaves(30 - usedLeaves); // Deduct used leaves from 30
    } catch (err) {
      console.error("Failed to fetch leave requests", err);
      setError("Failed to fetch leave requests");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

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


  

  const handleApplyLeave = () => {
    navigate("/leave/create");
  };

  // Grouping leave requests by leave type
  const groupedLeaveRequests = leaveRequests.reduce((acc, request) => {
    if (!acc[request.leave_type]) {
      acc[request.leave_type] = [];
    }
    acc[request.leave_type].push(request);
    return acc;
  }, {});

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
    <Box sx={{ display: "flex", mt: 8 }}> {/* Added mt: 8 for top margin */}
  <Sidebar handleApplyLeave={handleApplyLeave} handleLogout={handleLogout} />
  <Box sx={{ flexGrow: 1, p: 3 }}>
    <Navbar />
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Leave Applications
      </Typography>
      <Typography variant="h6" align="center" sx={{ mb: 4 }}>
        Remaining Leave Balance: {remainingLeaves} days
      </Typography>

      {Object.keys(groupedLeaveRequests).map((leaveType) => (
        <div key={leaveType}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {leaveType} Requests
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="leave requests table">
              <TableHead>
                <TableRow>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Number of Days</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedLeaveRequests[leaveType].map((request) => {
                  const startDate = new Date(request.start_date);
                  const endDate = new Date(request.end_date);
                  const diffInTime = endDate - startDate;
                  const diffInDays = diffInTime / (1000 * 3600 * 24); // Calculate days between start and end date
                  return (
                    <TableRow key={request.id}>
                      <TableCell>{request.leave_type}</TableCell>
                      <TableCell>{request.start_date}</TableCell>
                      <TableCell>{request.end_date}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>{diffInDays + 1}</TableCell> {/* +1 to include start date */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}

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

export default EmployeeDashboardPage;
