import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  Container,
} from "@mui/material";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    department: "",
    designation: "Employee",
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch departments from the API
    axios.get("'https://lmssolutions.xyz/api/accounts/departments/'").then((response) => {
      setDepartments(response.data); 
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post("accounts/register/", formData)
      .then(() => {
        // Navigate to login page upon success
        navigate("/login");
      })
      .catch((error) => {
        setError(error.response?.data || "An error occurred during registration.");
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </Alert>
        )}

        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Confirm Password"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          type="password"
          fullWidth
          margin="normal"
          required
        />

        <TextField
          select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value="">Select Department</MenuItem>
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.name}>
              {dept.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          {/* <MenuItem value="Admin">Admin</MenuItem> */}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Register
        </Button>

        <Typography align="center" variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button
            onClick={() => navigate("/login")}
            color="primary"
            size="small"
          >
            Login here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default RegisterPage;
