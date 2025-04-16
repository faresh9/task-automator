import React from 'react';
import './Loading.css'; // Assuming you have a CSS file for styling

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loading;