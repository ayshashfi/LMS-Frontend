import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../api/Componenets/sidebar';
import Navbar from '../api/Componenets/navbar';

const LeaveApprovalPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const navigate = useNavigate();

  // Fetch leave requests when the page loads
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(
          'https://lmssolutions.xyz/api/leave/manager/leave-requests/',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        setLeaveRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Error fetching leave requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle approval/rejection confirmation
  const handleApproval = async () => {
    if (selectedLeave) {
      try {
        await axios.patch(
          `https://lmssolutions.xyz/api/leave/manager/update-leave/${selectedLeave.id}/`,
          { status: selectedLeave.status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );

        setLeaveRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === selectedLeave.id ? { ...request, status: selectedLeave.status } : request
          )
        );
        setDialogOpen(false);
      } catch (err) {
        setError(err.response?.data?.detail || 'Error updating leave request status');
      }
    }
  };

  const openDialog = (id, status) => {
    const leave = leaveRequests.find((leave) => leave.id === id);
    setSelectedLeave({ ...leave, status });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedLeave(null);
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const days = timeDiff / (1000 * 3600 * 24);
    return days >= 0 ? days + 1 : 0; // Add 1 day to include the start day
  };

  if (loading) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Navbar username={localStorage.getItem("username") || "Manager"} /> {/* Include Navbar here */}
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Leave Requests Approval
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Leave Type</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Leave Days</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRequests.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell>{leave.username || 'Unknown Employee'}</TableCell>
                          <TableCell>{leave.leave_type}</TableCell>
                          <TableCell>{leave.start_date}</TableCell>
                          <TableCell>{leave.end_date}</TableCell>
                          <TableCell>{leave.reason}</TableCell>
                          <TableCell>{leave.status}</TableCell>
                          <TableCell>{calculateLeaveDays(leave.start_date, leave.end_date)}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => openDialog(leave.id, 'Approved')}
                              sx={{ marginRight: 1 }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => openDialog(leave.id, 'Rejected')}
                            >
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Dialog open={dialogOpen} onClose={closeDialog}>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to {selectedLeave?.status?.toLowerCase()} this leave request?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleApproval} color="primary">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LeaveApprovalPage;
