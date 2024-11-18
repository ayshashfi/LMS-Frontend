
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Container maxWidth="md">
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                textAlign="center"
                gap={2}
                sx={{
                    '@media (max-width: 600px)': {
                        paddingLeft: 2,
                        paddingRight: 2,
                    },
                }}
            >
                <Typography variant="h2" gutterBottom>
                    Welcome to the Leave Management System
                </Typography>
                <Typography variant="h6" color="textSecondary" paragraph>
                    Streamline your leave requests and approvals with ease. Whether you're an employee looking to apply for leave or a manager approving requests, our system makes it simple and efficient.
                </Typography>
                <Box mt={4}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleNavigate('/login')} 
                        sx={{ mr: 2 }}
                        aria-label="Login"
                    >
                        Login
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => handleNavigate('/register')}
                        aria-label="Register"
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LandingPage;
