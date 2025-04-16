// This file contains utility functions for formatting data, such as dates and numbers.

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString(undefined, options);
};

export const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
};

export const formatWorkflowStatus = (status) => {
    switch (status) {
        case 'active':
            return 'Active';
        case 'inactive':
            return 'Inactive';
        case 'error':
            return 'Error';
        default:
            return 'Unknown';
    }
};