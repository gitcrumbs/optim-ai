import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Validations from './Validations';
import TestSteps from './TestSteps';
import RequestBodySection from './RequestBodySection';
import ExpectedResults from './ExpectedResults';

interface ExpectedResult {
    status_code: number;
    headers: Record<string, string>;
    body: string;
    notes?: string;
}

interface Validation {
    jsonpath_expression: string;
    expected_value: string;
    assertion_type: string;
    validation_message: string;
    validated?: boolean;
}

interface TestCase {
    id: number;
    test_case_id:string;   
    test_case_title: string;
    description: string;
    test_steps: string[];
    expectedResults: ExpectedResult[];    
    validations?: Validation[];
    url?: string;
    headers?: string;
    requestBody?: string;
    testResults?: string;
}

interface ParsedTestCase extends TestCase {
    id: number;
    expected_results: {
        status_code: number | string;
        headers?: Record<string, string>;
        response_body?: Record<string, any>;
    };
}


interface DescriptionModalProps {
    open: boolean;
    onClose: () => void;
    testCase: ParsedTestCase | null;

}


const DescriptionModal: React.FC<DescriptionModalProps> = ({ open, onClose, testCase }) => {    
    if (!testCase) return null;   
    const [editableTestCase, setEditableTestCase] = useState<TestCase>(testCase);

    const handleChange = (field: string, value: any) => {
        setEditableTestCase({ ...editableTestCase, [field]: value });
    };

    const handleExpectedResultChange = (index: number, field: string, value: any) => {       

        const updatedExpectedResults = [...editableTestCase.expectedResults]; 

        updatedExpectedResults[index] = { ...updatedExpectedResults[index], [field]: value };
        setEditableTestCase({ ...editableTestCase, expectedResults: updatedExpectedResults });
    };

    const handleValidationChange = (index: number, field: string, value: any) => {
        const updatedValidations = [...(editableTestCase.validations || [])];
        updatedValidations[index] = { ...updatedValidations[index], [field]: value };
        setEditableTestCase({ ...editableTestCase, validations: updatedValidations });
    };

    const handleAddValidation = () => {
        const newValidation: Validation = {
            jsonpath_expression: '',
            expected_value: '',
            assertion_type: '',
            validation_message: '',
            validated: false,
        };
        setEditableTestCase({
            ...editableTestCase,
            validations: [...(editableTestCase.validations || []), newValidation],
        });
    };

    const handleDeleteValidation = (index: number) => {
        const updatedValidations = [...(editableTestCase.validations || [])];
        updatedValidations.splice(index, 1);
        setEditableTestCase({ ...editableTestCase, validations: updatedValidations });
    };

    const handleAddStep = () => {
        setEditableTestCase({
            ...editableTestCase,
            test_steps: [...editableTestCase.test_steps, ''],
        });
    };

    const handleDeleteStep = (index: number) => {
        const updatedSteps = [...editableTestCase.test_steps];
        updatedSteps.splice(index, 1);
        setEditableTestCase({ ...editableTestCase, test_steps: updatedSteps });
    };

    const handleSave = () => {       
        onClose();
    };

    const handleTest = () => {       
        // Add your test logic here
    };

    const handleCancel = () => {
        onClose();
    };

    const handleValidate = (index: number) => {       
        const updatedValidations = [...(editableTestCase.validations || [])];
        updatedValidations[index].validated = true;
        
        

        setEditableTestCase({ ...editableTestCase, validations: updatedValidations });
    };

    return (
        
        <Modal open={open} onClose={onClose} aria-labelledby="description-modal">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '96%',
                    height: '100%',
                    maxHeight: '95%',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: '7.5px 5px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flex: 1, overflowY: 'auto' }}>
                    <Box sx={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', gap: 2, padding: '9px' }}>
                        <Typography variant="h6" gutterBottom>
                            {editableTestCase.test_case_id}
                        </Typography>

                        <TextField
                            label="Title"
                            fullWidth
                            margin="dense"
                            value={editableTestCase.test_case_title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            sx={{ padding: '7.5px', fontSize: '0.875rem' }}
                            InputProps={{ style: { height: '30px' } }}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            margin="dense"
                            multiline
                            rows={3}
                            value={editableTestCase.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            sx={{ padding: '7.5px', fontSize: '0.875rem' }}
                        />

                        <TestSteps
                            steps={editableTestCase.test_steps}
                            onAddStep={handleAddStep}
                            onDeleteStep={handleDeleteStep}
                            onStepChange={(index, value) => {
                                const updatedSteps = [...editableTestCase.test_steps];
                                updatedSteps[index] = value;
                                setEditableTestCase({ ...editableTestCase, test_steps: updatedSteps });
                            }}
                        />
                    </Box>

                    <Box sx={{ flex: '0 0 25%', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '50%' }}>
                        <RequestBodySection
                            requestBody={editableTestCase.requestBody || ''}
                            onRequestBodyChange={(value) => handleChange('requestBody', value)}
                        />
                        <Validations
                            validations={editableTestCase.validations || []}
                            onAddValidation={handleAddValidation}
                            onDeleteValidation={handleDeleteValidation}
                            onValidationChange={handleValidationChange}
                            onValidate={handleValidate}
                        />
                    </Box>

                    <Box sx={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <ExpectedResults
                            expectedResults={editableTestCase.expectedResults}
                            onExpectedResultChange={handleExpectedResultChange}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, p: 2, borderTop: '1px solid #ddd' }}>
                    <Button variant="contained" color="primary" onClick={handleTest} sx={{ mr: 2 }}>
                        Test
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DescriptionModal;
