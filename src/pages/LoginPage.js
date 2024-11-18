import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress, Link } from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.post('accounts/login/', { username, password });

            // Log the response and designation
            console.log('Designation:', response.data.designation);  
            console.log('Navigating to:', response.data.designation.toLowerCase());

            // Store the token and designation in localStorage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('designation', response.data.designation);

            // Navigate based on designation
            const designation = response.data.designation.toLowerCase();
            if (designation === 'admin') {
                console.log('Navigating to admin dashboard');
                navigate('/admin-dashboard');
            } else if (designation === 'manager') {
                console.log('Navigating to manager dashboard');
                navigate('/manager-dashboard');
            } else if (designation === 'employee') {
                console.log('Navigating to employee dashboard');
                navigate('/employee-dashboard');
            } else {
                setError('Invalid designation');
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setError(error.response.data.detail || 'Invalid credentials');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <Container maxWidth="xs">
            <Box mt={5}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        autoComplete="off" // Disables autocomplete
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        autoComplete="off" // Disables autocomplete
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </form>
                {/* New User Register Link */}
                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        New User?{' '}
                        <Link
                            component="button"
                            onClick={() => navigate('/register')}
                            underline="hover"
                            sx={{ color: 'primary.main' }}
                        >
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
