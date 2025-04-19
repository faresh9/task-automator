import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TaskIcon from '@mui/icons-material/CheckCircle';
import ReplyIcon from '@mui/icons-material/Reply';

const EmailList = ({ emails }) => {
  if (!emails || emails.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No email data available
        </Typography>
      </Box>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };
  
  const renderActionIcons = (actions) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {actions.map((action, index) => {
          let icon = <InfoIcon />;
          let color = action.success ? 'primary' : 'error';
          
          if (action.type === 'calendar_event') {
            icon = <CalendarTodayIcon color={color} />;
          } else if (action.type === 'task_created') {
            icon = <TaskIcon color={color} />;
          } else if (action.type === 'email_reply') {
            icon = <ReplyIcon color={color} />;
          }
          
          return (
            <Tooltip key={index} title={`${action.type} - ${action.success ? 'Success' : 'Failed'}`}>
              <IconButton size="small">
                {icon}
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="email table">
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Received</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {emails.map((email) => (
            <TableRow
              key={email.emailId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{email.from}</TableCell>
              <TableCell>{email.subject}</TableCell>
              <TableCell>
                {new Date(email.receivedAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Chip label={email.category} size="small" />
              </TableCell>
              <TableCell>
                <Chip 
                  label={email.priority} 
                  color={getPriorityColor(email.priority)} 
                  size="small" 
                />
              </TableCell>
              <TableCell>
                {renderActionIcons(email.actions || [])}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmailList;