import React from 'react';
import { Drawer, Box, Toolbar, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('designation');

    // Redirect to login page
    navigate('/login', { replace: true });

    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
  };

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <Box sx={{ width: 240, bgcolor: 'primary.main', color: 'white', height: '100%' }}>
        <Toolbar />
        <List>
          <ListItem button onClick={() => navigate('/leave/create')}>
            <ListItemText primary="Apply Leave" />
          </ListItem>
          <ListItem button onClick={() => navigate('/profile')}>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
