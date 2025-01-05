import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { AutoFixHigh, AddCircle, Delete } from "@mui/icons-material";

const validHeaders = [
  "Content-Type",
  "Authorization",
  "Accept",
  "Cache-Control",
  "User-Agent",
  "X-Requested-With",
  "Host",
  "Connection",
  "Accept-Encoding",
  "Content-Length",
];

interface HeadersSectionProps {
  requestHeaders: string; // Prop for headers string
  handleRequestHeadersChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Handler to update headers
  jsonError: boolean; // Prop for JSON error
  setJsonError: (value: boolean) => void; // Handler to update JSON error
  rows: { key: string; value: string }[]; // Rows for headers
  setRows: (value: { key: string; value: string }[]) => void; // Handler to update rows
  addRow: () => void; // Handler to add a row
  handleKeyChange: (index: number, newKey: string) => void; // Handler to update key
  handleValueChange: (index: number, newValue: string) => void; // Handler to update value
  deleteRow: (index: number) => void; // Handler to delete a row
  setJsonViewer: (value: boolean) => void; // Handler to update JSON viewer
  jsonViewer: boolean; // Prop for JSON viewer
  headers: string; // Prop for headers string
  isHeadersHovered: boolean; // Prop for hover state
  setIsHeadersHovered: (value: boolean) => void; // Handler to update hover state
  handleHeaderChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Handler to update headers
  handleBeautify: () => void; // Handler to beautify headers
}

const HeadersSection: React.FC<HeadersSectionProps> = ({
  requestHeaders,
  handleRequestHeadersChange,
  jsonError,
  setJsonError,
  setRows,
  addRow,
  rows,
  handleKeyChange,
  handleValueChange,
  deleteRow,
  setJsonViewer,
  jsonViewer,
  headers,
  isHeadersHovered,
  setIsHeadersHovered,
  handleHeaderChange,
  handleBeautify,
}) => {
  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHeadersHovered(true)}
      onMouseLeave={() => setIsHeadersHovered(false)}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="subtitle2">Headers</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={jsonViewer}
              onChange={() => setJsonViewer(!jsonViewer)}
            />
          }
          label="JSON Viewer"
          sx={{
            marginLeft: "auto",
          }}
        />

        {!jsonViewer && (
          <IconButton
            onClick={handleBeautify}
            color="primary"
            disabled={!headers.trim() || jsonError}
            sx={{
              position: "absolute",
              top: 35,
              right: 10,
              opacity: isHeadersHovered ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              cursor: "pointer",
              zIndex: 1,
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <AutoFixHigh />
          </IconButton>
        )}
      </Box>

      {!jsonViewer ? (
        <TextField
          value={headers}
          onChange={handleHeaderChange}
          fullWidth
          multiline
          minRows={3}
          error={jsonError}
          helperText={jsonError ? "Invalid JSON Format" : ""}
          sx={{
            maxHeight: 130,
            overflow: "hidden",
            position: "relative",
            marginTop: 0,
            "& .MuiInputBase-root": {
              borderTop: "1px solid #ddd",
              borderLeft: "1px solid #ddd",
              borderRight: "1px solid #ddd",
              borderBottom: "1px solid #ddd",
              borderRadius: "4px",
              "&.Mui-focused": {
                borderColor: "#4C6E6C",
              },
              "&.Mui-error": {
                borderColor: "#f44336",
              },
            },
            "& .MuiInputBase-input": {
              padding: "0.5px 2px", // Smaller padding for text field
              fontSize: "0.75rem", // Reduced font size for compact look
              lineHeight: "1", // Reduce line height for more compact text
              height: "30px", // Fixed height to make the text field compact
            },
          }}
        />
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            maxHeight: 180, // Fixed height for scrollable area
            overflowY: "auto", // Enables scrolling when content exceeds the height
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    width: "50%",
                    padding: "4px 8px", // Reduced padding for table header
                    fontSize: "0.75rem",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff", // Ensure background is white
                    zIndex: 1, // Make sure it stays on top when scrolling
                  }}
                >
                  <Typography variant="subtitle2">Key</Typography>
                </TableCell>
                <TableCell
                  sx={{
                    width: "40%",
                    padding: "4px 8px", // Reduced padding for table header
                    fontSize: "0.75rem",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff", // Ensure background is white
                    zIndex: 1, // Make sure it stays on top when scrolling
                  }}
                >
                  <Typography variant="subtitle2">Value</Typography>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    padding: "4px 8px", // Reduced padding for table header
                    fontSize: "0.75rem",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff", // Ensure background is white
                    zIndex: 1, // Make sure it stays on top when scrolling
                  }}
                >
                  <IconButton onClick={addRow} sx={{ padding: 0 }}>
                    <AddCircle />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      padding: "2px 4px",
                      fontSize: "0.75rem",
                      height: 32, // Reduce cell height
                      maxWidth: "150px", // Constrain width for the cell
                    }}
                  >
                    <FormControl fullWidth sx={{ minWidth: 120 }}>
                      <Select
                        value={row.key}
                        onChange={(e) => handleKeyChange(index, e.target.value)} // Handle key change
                        sx={{
                          fontSize: "0.75rem",
                          padding: "0.5px 2px", // Reduced padding for select field
                          height: "25px", // Ensure compact height
                          "& .MuiSelect-select": {
                            padding: "0.5px 2px", // Apply padding for uniformity
                            fontSize: "0.75rem", // Matching font size
                          },
                        }}
                      >
                        {validHeaders
                          .filter(
                            (header) => !rows.some((r) => r.key === header)
                          ) // Ensure key is not duplicated
                          .map((header) => (
                            <MenuItem key={header} value={header}>
                              {header}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "2px 4px",
                      fontSize: "0.75rem",
                      height: 32, // Reduce cell height
                      maxWidth: "150px", // Constrain width for the cell
                    }}
                  >
                    <TextField
                      value={row.value}
                      onChange={(e) => handleValueChange(index, e.target.value)} // Handle value change
                      fullWidth
                      sx={{
                        fontSize: "0.85rem",
                        padding: "8px 0.9px 3px", // Reduce padding for input fields
                        lineHeight: "1", // Reduce line height for compact text
                        height: "30px", // Ensure compact height
                        "& .MuiInputBase-input": {
                          padding: "0.5px 2px", // Apply the padding to the input field
                          fontSize: "0.98rem", // Consistent font size for input
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => deleteRow(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HeadersSection;
