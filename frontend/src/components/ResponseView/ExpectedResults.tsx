import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Autocomplete, Switch, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'; // Importing the wand icon
import { JsonViewer } from '@textea/json-viewer';
import { styled } from '@mui/system';

interface ExpectedResult {
    status_code: number;
    headers: Record<string, string>;
    body: string;
    notes?: string;
}

interface ExpectedResultsProps {
    expectedResults: ExpectedResult[];
    onExpectedResultChange: (index: number, field: string, value: any) => void;
}

const statusMessages: Record<string, Record<number, string>> = {
    "1xx": {
        100: "Continue",
        101: "Switching Protocols",
        102: "Processing",
        103: "Early Hints"
    },
    "2xx": {
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        207: "Multi-Status",
        208: "Already Reported",
        226: "IM Used"
    },
    "3xx": {
        300: "Multiple Choices",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        308: "Permanent Redirect"
    },
    "4xx": {
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Payload Too Large",
        414: "URI Too Long",
        415: "Unsupported Media Type",
        416: "Range Not Satisfiable",
        417: "Expectation Failed",
        418: "I'm a Teapot",
        421: "Misdirected Request",
        422: "Unprocessable Entity",
        423: "Locked",
        424: "Failed Dependency",
        425: "Too Early",
        426: "Upgrade Required",
        428: "Precondition Required",
        429: "Too Many Requests",
        431: "Request Header Fields Too Large",
        451: "Unavailable For Legal Reasons"
    },
    "5xx": {
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
        506: "Variant Also Negotiates",
        507: "Insufficient Storage",
        508: "Loop Detected",
        510: "Not Extended",
        511: "Network Authentication Required"
    }
};

const statusCodeOptions = Object.entries(statusMessages).flatMap(([category, codes]) =>
    Object.entries(codes).map(([code, message]) => ({
        code: parseInt(code, 10),
        message
    }))
);

const possibleHeaders = [
    'Content-Type',
    'Authorization',
    'Accept',
    'Cache-Control',
    'User-Agent',
    'Referer',
    'Origin',
    'Host',
    'Connection',
    'Accept-Encoding',
    'Accept-Language',
    // Add more headers as needed
];

const statusColors: Record<string, string> = {
    "1xx": "#1E90FF", // DodgerBlue
    "2xx": "#32CD32", // LimeGreen
    "3xx": "#FFD700", // Gold
    "4xx": "#FF4500", // OrangeRed
    "5xx": "#FF6347"  // Tomato
};

const getStatusColor = (statusCode: number) => {
    const category = Math.floor(statusCode / 100) + "xx";
    return statusColors[category] || "gray";
};

const ColorDot: React.FC<{ color: string }> = ({ color }) => (
    <Box
        sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'inline-block',
            mr: 1
        }}
    />
);

const HoverBox = styled(Box)({
    position: 'relative',
    '&:hover .beautify-icon': {
        display: 'block',
    },
});

const BeautifyIconButton = styled(IconButton)({
    display: 'none',
    position: 'absolute',
    right: '10px',
    top: '20px', // Adjusted to move the icon a bit lower
});

const ExpectedResults: React.FC<ExpectedResultsProps> = ({ expectedResults, onExpectedResultChange }) => {
    const [headerCounter, setHeaderCounter] = useState(0);
    const [viewMode, setViewMode] = useState<'json' | 'raw'>('json');
    const [isValidJson, setIsValidJson] = useState(true);

    useEffect(() => {
        expectedResults.forEach((result, index) => {
            if (result.status_code) {
                handleStatusCodeChange(index, result.status_code);
            }
        });
    }, [expectedResults]);

    const handleAddHeader = (index: number) => {
        const newKey = `new-header-${headerCounter}`;
        const updatedHeaders = { ...expectedResults[index].headers, [newKey]: '' };
        onExpectedResultChange(index, 'headers', updatedHeaders);
        setHeaderCounter(headerCounter + 1);
    };

    const handleDeleteHeader = (index: number, key: string) => {
        const updatedHeaders = { ...expectedResults[index].headers };
        delete updatedHeaders[key];
        onExpectedResultChange(index, 'headers', updatedHeaders);
        setHeaderCounter(headerCounter - 1);
    };

    const handleStatusCodeChange = (index: number, value: number) => {
        let message = 'Unknown Status';
        for (const category in statusMessages) {
            if (statusMessages[category][value]) {
                message = statusMessages[category][value];
                break;
            }
        }
        onExpectedResultChange(index, 'status_code', value);
        onExpectedResultChange(index, 'notes', message);
    };

    const parseJson = (str: string) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return {};
        }
    };

    const handleBeautify = (index: number) => {
        const result = expectedResults[index];
    
        // Safeguard: Check if body is non-empty
        if (!result?.body || !result.body.trim()) {
            console.warn('Response body is empty or undefined.');
            return;
        }
    
        try {
            // Parse and format JSON safely
            const parsedBody = JSON.parse(result.body);
            const formattedJson = JSON.stringify(parsedBody, null, 2);
    
            // Update state with beautified JSON
            onExpectedResultChange(index, 'body', formattedJson);
            setIsValidJson(true);
        } catch (error) {
            // Log error and mark JSON as invalid
            console.error('Failed to beautify JSON:', error);
            setIsValidJson(false);
        }
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

    const handleTextFieldChange = (index: number, value: string) => {
        onExpectedResultChange(index, 'body', value);
        setIsValidJson(validateJson(value));
    };

    return (
        <Box>
            {expectedResults.map((result, index) => {
                const availableHeaders = possibleHeaders.filter(header => !Object.keys(result.headers).includes(header));
                return (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Expected Result
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" paragraph sx={{ mr: 1 }}>
                                <strong>Response Headers:</strong>
                            </Typography>
                            <IconButton onClick={() => handleAddHeader(index)} color="primary">
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    {Object.entries(result.headers).map(([key, value], rowIndex) => (
                                        <TableRow key={key}>
                                            <TableCell sx={{ padding: '4px', width: '220px' }}>
                                                <Autocomplete
                                                    options={availableHeaders}
                                                    getOptionLabel={(option) => option}
                                                    value={key}
                                                    onChange={(event, newValue) => {
                                                        if (newValue) {
                                                            const updatedHeaders = { ...result.headers, [newValue]: value };
                                                            delete updatedHeaders[key];
                                                            onExpectedResultChange(index, 'headers', updatedHeaders);
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Header Key"
                                                            margin="dense"
                                                            sx={{ width: '210px', height: '30px' }}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                style: {
                                                                    height: '30px',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ padding: '4px', width: '200px' }}>
                                                <TextField
                                                    value={value}
                                                    onChange={(e) => {
                                                        const updatedHeaders = { ...result.headers, [key]: e.target.value };
                                                        onExpectedResultChange(index, 'headers', updatedHeaders);
                                                    }}
                                                    fullWidth
                                                    margin="dense"
                                                    sx={{ width: '200px', height: '30px' }}
                                                    InputProps={{
                                                        style: {
                                                            height: '30px',
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            {rowIndex > 0 && (
                                                <TableCell sx={{ padding: '4px' }}>
                                                    <IconButton onClick={() => handleDeleteHeader(index, key)} color="secondary">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ width: '180px', mr: 2.5 }}>
                                <strong>Expected Status Code:</strong>
                            </Typography>
                            <ColorDot color={getStatusColor(result.status_code)} />
                            <Autocomplete
                                options={statusCodeOptions}
                                getOptionLabel={(option) => `${option.code}`}
                                value={statusCodeOptions.find((option) => option.code === result.status_code) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        handleStatusCodeChange(index, newValue.code);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Status Code"
                                        margin="dense"
                                        sx={{ width: '150px', height: '30px' }}
                                        InputProps={{
                                            ...params.InputProps,
                                            style: {
                                                height: '30px',
                                            },
                                            inputMode: 'numeric'
                                        }}
                                    />
                                )}
                            />
                            <Typography variant="body2" sx={{ width: '200px', ml: 2 }}>
                                {statusCodeOptions.find(option => option.code === result.status_code)?.message || 'No message provided'}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ marginRight: "100px", width: '190px', fontSize: '14px' }}>Expected Response Body:</strong>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={viewMode === 'json'}
                                            onChange={() => setViewMode(viewMode === 'json' ? 'raw' : 'json')}
                                            color="primary"
                                            sx={{ justifyContent: 'flex-end', ml: 14 }}
                                        />
                                    }
                                    label=""
                                    sx={{ ml: 'auto' }}
                                />
                            </Box>
                            {viewMode === 'json' && isValidJson ? (
                                <JsonViewer
                                    value={parseJson(result.body)}
                                    theme="light"
                                    displayDataTypes={false}
                                    style={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '4px',
                                        padding: '8px',
                                        overflow: 'auto',
                                        height: '90%',
                                    }}
                                />
                            ) : (
                                <HoverBox>
                                    <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                                        {!isValidJson && 'Invalid JSON'}
                                    </Typography>
                                    <TextField
                                       value={typeof result.body === 'string' ? result.body : JSON.stringify(result.body, null, 2)}
                                        onChange={(e) => handleTextFieldChange(index, e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={10}
                                        variant="outlined"
                                        sx={{ mt: 1 }} // Adjusted to reduce the gap
                                        error={!isValidJson}
                                        InputProps={{
                                            style: {
                                                borderColor: !isValidJson ? 'red' : '',
                                            },
                                        }}
                                    />
                                    <BeautifyIconButton
                                        className="beautify-icon"
                                        onClick={() => handleBeautify(index)}
                                        color="primary"
                                        disabled={!result?.body}
                                    >
                                        <AutoFixHighIcon />
                                    </BeautifyIconButton>
                                </HoverBox>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default ExpectedResults;