import React, { useState, useEffect } from 'react';
import { getApiSettings, updateApiSettings } from '../../api/n8nApi';
import './ApiSettings.css';

const ApiSettings = () => {
    const [apiUrl, setApiUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApiSettings = async () => {
            try {
                const settings = await getApiSettings();
                setApiUrl(settings.url);
                setApiKey(settings.key);
            } catch (err) {
                setError('Failed to fetch API settings');
            } finally {
                setLoading(false);
            }
        };

        fetchApiSettings();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            await updateApiSettings({ url: apiUrl, key: apiKey });
            alert('API settings updated successfully');
        } catch (err) {
            setError('Failed to update API settings');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="api-settings">
            <h2>API Settings</h2>
            {error && <div className="error">{error}</div>}
            <div>
                <label>
                    API URL:
                    <input
                        type="text"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    API Key:
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default ApiSettings;