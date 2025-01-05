import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, IconButton, Switch } from '@mui/material';
import { JsonViewer } from '@textea/json-viewer';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface RequestBodySectionProps {
    requestBody: string;
    onRequestBodyChange: (value: string) => void;
}

const RequestBodySection: React.FC<RequestBodySectionProps> = ({ requestBody, onRequestBodyChange }) => {
    const [isJsonView, setIsJsonView] = useState(true);
    const [isValidJson, setIsValidJson] = useState(true);

    useEffect(() => {
        setIsValidJson(validateJson(requestBody));
    }, [requestBody]);

    const handleToggleView = () => {
        setIsJsonView(!isJsonView);
    };

    const handleJsonChange = (json: any) => {
        onRequestBodyChange(JSON.stringify(json, null, 2));
    };

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onRequestBodyChange(value);
        setIsValidJson(validateJson(value));
    };

    const validateJson = (str: string) => {
        if (!str.trim()) {
            return true; // Consider empty string as valid JSON
        }
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleBeautify = () => {
        if (isValidJson && requestBody.trim()) {
            const formattedJson = JSON.stringify(JSON.parse(requestBody), null, 2);
            onRequestBodyChange(formattedJson);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Request Body
                </Typography>
                <Switch
                    checked={isJsonView}
                    onChange={handleToggleView}
                    color="primary"
                />
            </Box>
            {isJsonView && isValidJson && requestBody.trim() ? (
                <JsonViewer
                    value={JSON.parse(requestBody)}
                    onChange={handleJsonChange}
                    theme="light"
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            ) : (
                <Box sx={{ position: 'relative' }}>
                    <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                        {!isValidJson && 'Invalid JSON'}
                    </Typography>
                    <TextField
                        value={requestBody}
                        onChange={handleTextFieldChange}
                        fullWidth
                        multiline
                        rows={8}
                        variant="outlined"
                        error={!isValidJson}
                        InputProps={{
                            style: {
                                borderColor: !isValidJson ? 'red' : '',
                            },
                        }}
                    />
                    <IconButton
                        onClick={handleBeautify}
                        color="primary"
                        disabled={!requestBody.trim()}
                        sx={{ position: 'absolute', right: 10, top: 10 }}
                    >
                        <AutoFixHighIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default RequestBodySection;