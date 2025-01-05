import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';


const getStatusColor = (status: string) => {
    switch (status) {
        case 'Running':
            return 'primary';
        case 'Passed':
            return 'success';
        case 'Failed':
            return 'error';
        case 'Pending':
            return 'warning';
        default:
            return 'inherit';
    }
};

const ConfiguredSuiteTable = ({ suites }: { suites: any[] }) => {
    const navigate = useNavigate();
    const [suiteList, setSuiteList] = useState(suites);

    const handleEditClick = (suite: any) => {
        const url = `/edit-suite/${suite.id}`;
        const state = { suite };
        const newTab = window.open(url, '_blank');
        if (newTab) {
            newTab.onload = () => {
                newTab.history.replaceState(state, '', url);
            };
        }
    };

    return (
        <div className={`configured-suite-items`}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>TestName</TableCell>
                            <TableCell>Number of API Steps</TableCell>
                            <TableCell>Last Executed On</TableCell>
                            <TableCell>Last Executed By</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suiteList.map((suite) => (
                            <TableRow key={suite.id}>
                                <TableCell>{suite.testName}</TableCell>
                                <TableCell>{suite.numberOfApiSteps}</TableCell>
                                <TableCell>{suite.lastExecutedOn}</TableCell>
                                <TableCell>{suite.lastExecutedBy}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color={getStatusColor(suite.status)}>
                                        {suite.status}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEditClick(suite)}>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ConfiguredSuiteTable;
