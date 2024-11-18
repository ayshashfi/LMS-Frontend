import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Toolbar } from '@mui/material';
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
          <ListItem button onClick={() => navigate('/employee-list')}>
            <ListItemText primary="Team Members" />
          </ListItem>
          <ListItem button onClick={() => navigate('/leave-approval')}>
            <ListItemText primary="Leave Requests" />
          </ListItem>
          <ListItem button onClick={() => navigate('/leave-report')}>
            <ListItemText primary="Leave Report" />
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
