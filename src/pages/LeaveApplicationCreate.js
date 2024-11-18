import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';
import Navbar from '../api/Componenets/empnavbar';
import Sidebar from '../api/Componenets/empsidebar';

const LeaveApplicationCreate = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [validLeaveDays, setValidLeaveDays] = useState(0);
  const [remainingLeaveDays, setRemainingLeaveDays] = useState(30); // Assuming 30 days max leave per year
  const navigate = useNavigate();

  // Function to calculate valid leave days (excluding Sundays)
  const calculateValidLeaveDays = (start, end) => {
    let count = 0;
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    while (startDateObj <= endDateObj) {
      const dayOfWeek = startDateObj.getDay();
      if (dayOfWeek !== 0) count++; // Exclude Sundays
      startDateObj.setDate(startDateObj.getDate() + 1);
    }
    return count;
  };

  // Fetch available leave days for the employee
  const fetchRemainingLeaveDays = async () => {
    try {
      const response = await axios.get(
        'https://lmssolutions.xyz/api/leave/remaining-leaves/', 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setRemainingLeaveDays(response.data.remaining_leave_days);
    } catch (err) {
      console.error('Error fetching remaining leave days:', err);
    }
  };

  // Handle Start Date change
  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    if (selectedStartDate && endDate) {
      setValidLeaveDays(calculateValidLeaveDays(selectedStartDate, endDate));
    }
  };

  // Handle End Date change
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    setEndDate(selectedEndDate);
    if (startDate && selectedEndDate) {
      setValidLeaveDays(calculateValidLeaveDays(startDate, selectedEndDate));
    }
  };

  // Submit Leave Application
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
  
    if (new Date(startDate) < new Date()) {
      setError({ start_date: 'Start date cannot be in the past.' });
      setLoading(false);
      return;
    }
  
    if (new Date(endDate) < new Date()) {
      setError({ end_date: 'End date cannot be in the past.' });
      setLoading(false);
      return;
    }
  
    if (validLeaveDays <= 0) {
      setError({ dates: 'Please select valid leave dates.' });
      setLoading(false);
      return;
    }
  
    if (validLeaveDays > remainingLeaveDays) {
      setError({ dates: `You cannot take more than ${remainingLeaveDays} days off this year.` });
      setLoading(false);
      return;
    }
  
    const leaveData = {
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason: reason,
    };
  
    try {
      await axios.post(
        'https://lmssolutions.xyz/api/leave/create/',
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
  
      // Update remaining leave days
      setRemainingLeaveDays(remainingLeaveDays - validLeaveDays);
  
      // Navigate to employee dashboard after successful submission
      navigate('/employee-dashboard'); 
    } catch (err) {
      const backendErrors = err.response?.data || {};
      setError(backendErrors);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRemainingLeaveDays();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar is here */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 5 }}
      >
        <Navbar /> {/* Navbar is here */}
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Submit Leave Application
          </Typography>

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                label="Leave Type"
              >
                <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                <MenuItem value="Annual Leave">Annual Leave</MenuItem>
                <MenuItem value="Casual Leave">Casual Leave</MenuItem>
              </Select>
            </FormControl>
            {error.leave_type && (
              <Typography color="error" variant="body2">{error.leave_type}</Typography>
            )}

            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            {error.start_date && (
              <Typography color="error" variant="body2">{error.start_date}</Typography>
            )}

            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            {error.end_date && (
              <Typography color="error" variant="body2">{error.end_date}</Typography>
            )}

            <TextField
              fullWidth
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />
            {error.reason && (
              <Typography color="error" variant="body2">{error.reason}</Typography>
            )}

            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
              Remaining Leave Days: {remainingLeaveDays}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
              Valid Leave Days: {validLeaveDays}
            </Typography>
            {error.dates && (
              <Typography color="error" variant="body2">{error.dates}</Typography>
            )}

            <Grid container spacing={2} sx={{ marginTop: 2 }}>
             
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default LeaveApplicationCreate;
