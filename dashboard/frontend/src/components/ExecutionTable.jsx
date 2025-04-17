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
  Typography
} from '@mui/material';

const ExecutionTable = ({ executions }) => {
  if (!executions || executions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No execution data available
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="execution table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Started</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Node</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {executions.map((execution) => (
            <TableRow
              key={execution.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {execution.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                {new Date(execution.startedAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {Math.round((new Date(execution.stoppedAt) - new Date(execution.startedAt)) / 1000)}s
              </TableCell>
              <TableCell>
                <Chip 
                  label={execution.status} 
                  color={execution.status === 'success' ? 'success' : execution.status === 'error' ? 'error' : 'warning'} 
                  size="small" 
                />
              </TableCell>
              <TableCell>{execution.node}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExecutionTable;
