import React from 'react';
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link } from 'react-router-dom';  

const Navbar = ({ username }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}  
          to="/manager-dashboard"  
          sx={{ textDecoration: 'none', color: 'white' }}  
        >
          Manager Dashboard
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body1" sx={{ mr: 2 }}>
          {/* {username} You can display the username here if you want */}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
