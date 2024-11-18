import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/employee-dashboard'); 
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={handleDashboardClick}
          sx={{ cursor: 'pointer' }} 
        >
          Employee Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
