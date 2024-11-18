import React, { useEffect, useState } from "react";
import { Typography, Paper, Grid, CircularProgress, Box, Accordion, AccordionSummary, AccordionDetails, Alert, Container, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../api/Componenets/sidebar";
import Navbar from "../api/Componenets/navbar";

const LeaveReportPage = () => {
  const [leaveReport, setLeaveReport] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");  // New state for search query
  const navigate = useNavigate();

  const totalAnnualLeave = 30;

  const fetchLeaveReports = async () => {
    try {
      const response = await axios.get(
        'https://lmssolutions.xyz/api/leave/total-leaves-report/',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setLeaveReport(response.data);  
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching leave report');  
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    fetchLeaveReports();  
  }, []);  

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());  // Update search query on input change
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const groupedLeaveReport = leaveReport.reduce((acc, report) => {
    const username = report.user__username;
    if (!acc[username]) {
      acc[username] = {
        username,
        leaves: [],
        totalLeaveDays: 0,
        approvedLeaveDays: 0,
      };
    }

    const leaveDays = report.total_leave_days;
    acc[username].leaves.push({
      leaveType: report.leave_type,
      status: report.status,
      startDate: new Date(report.start_date).toLocaleDateString(),
      endDate: new Date(report.end_date).toLocaleDateString(),
      totalLeaveDays: leaveDays,
    });

    if (report.status.toLowerCase() === "approved") {
      acc[username].approvedLeaveDays += leaveDays;
    }

    acc[username].totalLeaveDays += leaveDays;
    return acc;
  }, {});

  const leaveReportArray = Object.values(groupedLeaveReport);

  // Filter employees based on the search query
  const filteredLeaveReport = leaveReportArray.filter(employeeReport => 
    employeeReport.username.toLowerCase().includes(searchQuery)
  );

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />  {/* Add Sidebar */}
      
      <Box sx={{ flexGrow: 1, p: 3, mt: 6 }}> 
        <Navbar />  {/* Add Navbar */}

        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold", marginBottom: 3 }}>
            Leave Reports
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* Search Field */}
          <TextField
            label="Search Employee"
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by employee username"
          />

          {filteredLeaveReport.map((employeeReport) => {
            const remainingLeave = totalAnnualLeave - employeeReport.approvedLeaveDays;

            return (
              <Accordion
                key={employeeReport.username}
                expanded={expanded === employeeReport.username}
                onChange={handleChange(employeeReport.username)}
                sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${employeeReport.username}-content`}
                  id={`${employeeReport.username}-header`}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                    {employeeReport.username}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: "medium" }}>
                    Total Leave Days: <span style={{ fontWeight: "bold" }}>{employeeReport.totalLeaveDays}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: "medium" }}>
                    Approved Leave Days: <span style={{ fontWeight: "bold" }}>{employeeReport.approvedLeaveDays}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: "medium" }}>
                    Remaining Leave Days: <span style={{ fontWeight: "bold" }}>{remainingLeave}</span>
                  </Typography>

                  <Grid container spacing={3}>
                    {employeeReport.leaves.map((leave, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 1,
                            backgroundColor: "#ffffff",
                            textAlign: "left",
                            borderLeft: "4px solid #3f51b5",
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {leave.leaveType}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#555", mb: 1 }} >
                            Status: <strong>{leave.status}</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#555" }}>
                            Start Date: {leave.startDate}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#555" }}>
                            End Date: {leave.endDate}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#555" }}>
                            Total Leave Days: <strong>{leave.totalLeaveDays}</strong>
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Container>
      </Box>
    </Box>
  );
};

export default LeaveReportPage;
