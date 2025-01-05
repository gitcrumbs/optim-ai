import React from 'react';
import { Box, TextField, IconButton, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface TestStepsProps {
    steps: string[];
    onAddStep: () => void;
    onDeleteStep: (index: number) => void;
    onStepChange: (index: number, value: string) => void;
}

const TestSteps: React.FC<TestStepsProps> = ({ steps, onAddStep, onDeleteStep, onStepChange }) => {

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom>
                    Test Steps
                </Typography>
                <IconButton color="primary" onClick={onAddStep}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Paper
                sx={{
                    padding: 2,
                    maxHeight: 200,
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflowX: 'hidden', // Prevent horizontal scrolling
                }}
            >
                {
                 
                    
                steps.map((step, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TextField
                            label={`Step ${index + 1}`}
                            fullWidth
                            margin="dense"
                            value={step}
                            onChange={(e) => onStepChange(index, e.target.value)}
                            sx={{ padding: '7.5px', fontSize: '0.875rem', maxWidth: '100%' }}
                            InputProps={{ style: { height: '30px' } }}
                        />
                        <IconButton color="secondary" onClick={() => onDeleteStep(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

export default TestSteps;