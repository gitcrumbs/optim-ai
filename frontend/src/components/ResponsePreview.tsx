import React, { useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, TextField, Checkbox, Button, IconButton, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';

interface ResponsePreviewProps {
    selectedFields: string[];
    sampleJsonResponse: { [key: string]: any };
    transformations: { [key: string]: { name: string; fields: string[]; value: string } };
    handleTransformationChange: (field: string, transformation: { name: string; fields: string[]; value: string }) => void;
}

const ResponsePreview: React.FC<ResponsePreviewProps> = ({ selectedFields, sampleJsonResponse, transformations, handleTransformationChange }) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [transformationName, setTransformationName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleItemSelection = (field: string) => {
        setSelectedItems((prev) =>
            prev.includes(field) ? prev.filter((item) => item !== field) : [...prev, field]
        );
    };

    const handleApplyTransformation = () => {
        const finalValue = selectedItems
            .map((item) => item.split('.').reduce((acc, key) => acc[key], sampleJsonResponse))
            .join(', ');
        const transformation = {
            name: transformationName,
            fields: selectedItems,
            value: finalValue,
        };
        selectedItems.forEach((item) => {
            handleTransformationChange(item, transformation);
        });
        setSelectedItems([]);
        setTransformationName('');
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const groupedTransformations = Object.values(transformations).reduce((acc, transformation) => {
        if (!acc[transformation.name]) {
            acc[transformation.name] = { ...transformation, fields: [] };
        }
        acc[transformation.name].fields.push(...transformation.fields);
        return acc;
    }, {} as { [key: string]: { name: string; fields: string[]; value: string } });

    const transformedFields = new Set(Object.values(transformations).flatMap(transformation => transformation.fields));

    return (
        <Paper style={{ padding: 16, height: '500px', overflow: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Response Preview</Typography>
                <IconButton onClick={handleOpenModal}>
                    <ViewListIcon />
                </IconButton>
            </Box>
            <List>
                {selectedFields.filter(field => !transformedFields.has(field)).map((field) => (
                    <ListItem key={field}>
                        <Checkbox
                            checked={selectedItems.includes(field)}
                            onChange={() => handleItemSelection(field)}
                        />
                        <ListItemText primary={`${field}: ${field.split('.').reduce((acc, key) => acc[key], sampleJsonResponse)}`} />
                    </ListItem>
                ))}
            </List>
            {selectedItems.length > 0 && (
                <div style={{ marginTop: 16 }}>
                    <TextField
                        label="Transformation Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={transformationName}
                        onChange={(e) => setTransformationName(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyTransformation}
                        style={{ marginTop: 16 }}
                    >
                        Apply Transformation
                    </Button>
                </div>
            )}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box style={{ padding: 16, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '50%', maxHeight: '80vh', overflow: 'auto' }}>
                    <Typography variant="h6">Transformations</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Transformation Name</TableCell>
                                    <TableCell>Final Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.values(groupedTransformations).map((transformation) => (
                                    <TableRow key={transformation.name}>
                                        <TableCell>{transformation.name}</TableCell>
                                        <TableCell>{transformation.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained" color="primary" onClick={handleCloseModal} style={{ marginTop: 16 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </Paper>
    );
};

export default ResponsePreview;