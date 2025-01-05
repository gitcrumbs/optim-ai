import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface Validation {
    jsonpath_expression: string;
    expected_value: string;
    assertion_type: string;
    validation_message: string;
    validated?: boolean;
}

interface ValidationsProps {
    validations: Validation[];
    onAddValidation: () => void;
    onDeleteValidation: (index: number) => void;
    onValidationChange: (index: number, field: string, value: any) => void;
    onValidate: (index: number) => void;
}

const Validations: React.FC<ValidationsProps> = ({ validations, onAddValidation, onDeleteValidation, onValidationChange, onValidate }) => {
    return (
        <Box sx={{ mt: 2 ,width:'98%'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',  }}>
                <Typography variant="h6" gutterBottom>
                    Validations
                </Typography>
                <IconButton color="primary" onClick={onAddValidation}>
                    <AddIcon />
                </IconButton>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 200, overflowY: 'auto',overflowX: 'hidden' }}>
                <Table sx={{ width:'98%' }} aria-label="validations table">
                    <TableHead>
                        <TableRow>
                            <TableCell>JSONPath Expression</TableCell>
                            <TableCell>Expected Value</TableCell>
                            <TableCell>Assertion Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {validations.map((validation, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ padding: '4px' }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        value={validation.jsonpath_expression}
                                        onChange={(e) => onValidationChange(index, 'jsonpath_expression', e.target.value)}
                                        sx={{ padding: '4px', fontSize: '0.875rem' }}
                                        InputProps={{ style: { height: '30px' } }}
                                    />
                                </TableCell>
                                <TableCell sx={{ padding: '4px' }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        value={validation.expected_value}
                                        onChange={(e) => onValidationChange(index, 'expected_value', e.target.value)}
                                        sx={{ padding: '4px', fontSize: '0.875rem' }}
                                        InputProps={{ style: { height: '30px' } }}
                                    />
                                </TableCell>
                                <TableCell sx={{ padding: '4px' }}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        value={validation.assertion_type}
                                        onChange={(e) => onValidationChange(index, 'assertion_type', e.target.value)}
                                        sx={{ padding: '4px', fontSize: '0.875rem' }}
                                        InputProps={{ style: { height: '30px' } }}
                                    />
                                </TableCell>
                                <TableCell sx={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
                                    <IconButton color="primary" onClick={() => onValidate(index)}>
                                        {validation.validated ? <CheckCircleIcon /> : <PlayArrowIcon />}
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => onDeleteValidation(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Validations;