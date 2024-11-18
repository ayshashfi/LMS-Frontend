
import React, { useState } from "react";
import { Box, Container, Grid, Paper, Button, Typography,Toolbar  } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../api/Componenets/sidebar";
import Navbar from "../api/Componenets/navbar";

const ManagerDashboardPage = () => {
  const navigate = useNavigate();

  
  const managerUsername = localStorage.getItem("username") ; 

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


  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Navbar username={managerUsername} /> 
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Manager!
          </Typography>
          <Grid container spacing={3}>
            {/* View Team Members Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                  View Team Members
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate("/employee-list")}
                  sx={{ textTransform: "none" }}
                >
                  View All Employees
                </Button>
              </Paper>
            </Grid>

            {/* Manage Leave Requests Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                  Manage Leave Requests
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate("/leave-approval")}
                  sx={{ textTransform: "none" }}
                >
                  View Pending Leave Requests
                </Button>
              </Paper>
            </Grid>

            {/* View Leave Reports Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                  View Leave Reports
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate("/leave-report")}
                  sx={{ textTransform: "none" }}
                >
                  View Leave Report
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ManagerDashboardPage;
