import React, { useEffect, useState } from 'react';
import { Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Box, Grid, Button } from '@mui/material';
import axios from 'axios';
import Sidebar from '../api/Componenets/sidebar';
import Navbar from '../api/Componenets/navbar';
import { useNavigate } from 'react-router-dom';

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/accounts/employees/department/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        setError(error.response?.data?.detail || 'Error fetching employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Retrieve the manager's username from localStorage
  const managerUsername = localStorage.getItem('username') || 'Manager';

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />
      
      <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}> {/* Adjusted margin-top (mt: 8) to avoid overlap */}
        {/* Navbar */}
        <Navbar username={managerUsername} />
        
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Employee List
          </Typography>
          
          {/* Error or Loading Indicators */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          ) : employees.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              No employees found in your department.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {/* Display Employee Table */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Designation</TableCell>
                          <TableCell>Department</TableCell> {/* Changed to Department */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>{employee.id}</TableCell>
                            <TableCell>{employee.username}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.designation}</TableCell>
                            <TableCell>{employee.department}</TableCell> 
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default EmployeeListPage;
