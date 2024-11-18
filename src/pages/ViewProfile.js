import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    CircularProgress,
    Avatar,
    Divider,
    Box,
} from '@mui/material';
import axios from 'axios';
import Navbar from '../api/Componenets/empnavbar';
import Sidebar from '../api/Componenets/empsidebar';

const ViewProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        department_name: '',
        designation: '',
    });

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('https://lmssolutions.xyz/api/accounts/profile/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setUser(response.data);
                setFormData({
                    email: response.data.email,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    phone_number: response.data.phone_number,
                    department_name: response.data.department_name,
                    designation: response.data.designation,
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                'https://lmssolutions.xyz/api/accounts/profile/update/',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );
            setUser(response.data);
            setIsEditing(false); // Disable editing mode after saving
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="md" style={{ marginTop: '20px', textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" style={{ marginTop: '10px' }}>
                    Loading Profile...
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Navbar */}
            <Navbar />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Container maxWidth="md">
                    <Paper
                        elevation={3}
                        style={{
                            padding: '40px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        {/* Profile Avatar */}
                        <Avatar
                            alt={user.username}
                            src="/profile-placeholder.png" 
                            style={{
                                margin: '0 auto',
                                width: '100px',
                                height: '100px',
                                marginBottom: '20px',
                            }}
                        />
                        <Typography variant="h5" gutterBottom>
                            {user.username || 'N/A'}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                            {user.designation || 'N/A'}
                        </Typography>
                        <Divider style={{ margin: '20px 0' }} />

                        {/* User Details */}
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* First Name */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        name="first_name"
                                        value={formData.first_name || ''}
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                {/* Last Name */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        name="last_name"
                                        value={formData.last_name || ''}
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                {/* Email */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={formData.email || ''}
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                {/* Phone Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone Number"
                                        name="phone_number"
                                        value={formData.phone_number || ''}
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                {/* Department */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Department"
                                        name="department_name"
                                        value={formData.department_name || ''}
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                {/* Designation */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Designation"
                                        name="designation"
                                        value={formData.designation || ''}
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '20px' }}
                                fullWidth
                                type="submit"
                                disabled={!isEditing}
                            >
                                Save Changes
                            </Button>
                        </form>

                        {/* Edit Toggle */}
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '10px' }}
                            fullWidth
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>

                       
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default ViewProfile;
