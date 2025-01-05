import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

interface TestCase {
    title: string;
    steps: string[];
}

interface TestCasesDisplayProps {
    apiUrl: string;
}

const TestCasesDisplay: React.FC<TestCasesDisplayProps> = ({ apiUrl }) => {
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(apiUrl);
                const data = await res.json();
                setResponse(data.response);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    const parseResponse = (response: string) => {
        const lines = response.split('\n');
        const testCases: TestCase[] = [];
        let currentTestCase: TestCase | null = null;

        lines.forEach(line => {
            if (line.startsWith('**Test Case')) {
                if (currentTestCase) {
                    testCases.push(currentTestCase);
                }
                currentTestCase = { title: line, steps: [] };
            } else if (currentTestCase) {
                currentTestCase.steps.push(line);
            }
        });

        if (currentTestCase) {
            testCases.push(currentTestCase);
        }

        return testCases;
    };

    const testCases = parseResponse(response);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                Functional Test Cases
            </Typography>
            {testCases.map((testCase, index) => (
                <Paper key={index} style={{ padding: 16, marginBottom: 16 }}>
                    <Typography variant="h6" gutterBottom>
                        {testCase.title}
                    </Typography>
                    <List>
                        {testCase.steps.map((step, stepIndex) => (
                            <ListItem key={stepIndex}>
                                <ListItemText primary={step} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ))}
        </Box>
    );
};

export default TestCasesDisplay;