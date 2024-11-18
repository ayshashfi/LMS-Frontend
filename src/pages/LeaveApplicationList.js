                  import React, { useEffect, useState } from 'react';
                  import axios from 'axios';
                  import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, Paper } from '@mui/material';
                  import { useNavigate } from 'react-router-dom';

                  const LeaveApplicationList = () => {
                    const [leaveApplications, setLeaveApplications] = useState([]);
                    const [error, setError] = useState(null);
                    const [remainingLeaveDays, setRemainingLeaveDays] = useState(30); // Default to 30
                    const navigate = useNavigate();

                    useEffect(() => {
                      const fetchRemainingLeaveDays = async () => {
                        try {
                          const response = await axios.get('http://127.0.0.1:8000/api/leave/remaining-leaves/', {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                            },
                          });
                          setRemainingLeaveDays(response.data.remaining_leave_days);
                        } catch (err) {
                          console.error('Error fetching remaining leave days:', err);
                        }
                      };

                      const fetchLeaveApplications = async () => {
                        try {
                          const response = await axios.get(
                            'http://127.0.0.1:8000/api/leave/list/', 
                            {
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                              },
                            }
                          );
                          setLeaveApplications(response.data);
                        } catch (err) {
                          setError('Failed to load leave applications.');
                        }
                      };

                      fetchRemainingLeaveDays();
                      fetchLeaveApplications();
                    }, []);

                    const calculateLeaveDays = (startDate, endDate) => {
                      const start = new Date(startDate);
                      const end = new Date(endDate);
                      const timeDiff = end.getTime() - start.getTime();
                      return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Including start day
                    };

                    return (
                      <Container>
                        <Typography variant="h4" gutterBottom>
                          Leave Applications List
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                          Remaining Leave Days: {remainingLeaveDays}
                        </Typography>

                        {error && <Typography color="error">{error}</Typography>}

                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Leave Type</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Leave Days</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {leaveApplications.map((application) => {
                                const leaveDays = calculateLeaveDays(application.start_date, application.end_date);
                                return (
                                  <TableRow key={application.id}>
                                    <TableCell>{application.leave_type}</TableCell>
                                    <TableCell>{application.start_date}</TableCell>
                                    <TableCell>{application.end_date}</TableCell>
                                    <TableCell>{application.reason}</TableCell>
                                    <TableCell>{application.status}</TableCell>
                                    <TableCell>{leaveDays}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                          <Grid item xs={6}>
                            <Button
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              onClick={() => navigate('/leave/create')}
                            >
                              Apply for Leave
                            </Button>
                          </Grid>
                        </Grid>
                      </Container>
                    );
                  };

                  export default LeaveApplicationList;
