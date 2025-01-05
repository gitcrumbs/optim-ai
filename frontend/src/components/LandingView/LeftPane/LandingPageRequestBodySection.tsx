import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { AutoFixHigh } from "@mui/icons-material";

// Define props interface
interface LandingPageRequestBodySectionProps {
  requestBody: string;
  onRequestBodyChange: (value: string) => void;
  handleExpectedStatusCodeChange: (value: number) => void;
  expectedStatusCode: number;
}

const LandingPageRequestBodySection: React.FC<
  LandingPageRequestBodySectionProps
> = ({
  requestBody,
  onRequestBodyChange,
  handleExpectedStatusCodeChange,
  expectedStatusCode,
}) => {
  const [isRequestBodyHovered, setIsRequestBodyHovered] =
    useState<boolean>(false);
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true); // Track JSON validity

  const handleBeautify = () => {
    if (!requestBody.trim()) return;
    try {
      // Try parsing the input JSON
      const parsedJson = JSON.parse(requestBody);
      // Beautify the parsed JSON
      const beautifiedJson = JSON.stringify(parsedJson, null, 2);
      // Update the request body with the beautified JSON
      onRequestBodyChange(beautifiedJson);
      console.log("Beautify successful:", beautifiedJson); // Log successful beautification
    } catch (error) {
      console.error("Invalid JSON format for beautify:", error);
    }
  };

  const handleRequestBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onRequestBodyChange(newValue);

    // Validate JSON while typing
    if (newValue.trim()) {
      try {
        JSON.parse(newValue);
        setIsJsonValid(true); // Set valid JSON state
      } catch {
        setIsJsonValid(false); // Set invalid JSON state
      }
    } else {
      setIsJsonValid(true); // Reset error if there's no content
    }
  };

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsRequestBodyHovered(true)}
      onMouseLeave={() => setIsRequestBodyHovered(false)}
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "93%", // Adjust width to 93%
        border: "1px solid #ccc", // Border for visibility
        borderRadius: "4px",
        backgroundColor: "#fff", // White background to make sure it's visible
      }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="subtitle2">Request Body</Typography>

        {/* Status Code Dropdown */}
        <FormControl sx={{ minWidth: 90 }}>
          <InputLabel>Status Code</InputLabel>
          <Select
            value={expectedStatusCode}
            onChange={(e) =>
              handleExpectedStatusCodeChange(Number(e.target.value))
            }
            sx={{ height: 30 }} // Reduced height for the select box
          >
            <MenuItem value={200}>200</MenuItem>
            <MenuItem value={400}>400</MenuItem>
            <MenuItem value={404}>404</MenuItem>
            <MenuItem value={500}>500</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Beautify Icon Button */}
      <IconButton
        onClick={handleBeautify} // Call handleBeautify when clicked
        color="primary"
        disabled={!isJsonValid || !requestBody.trim()} // Disable if JSON is invalid or if request body is empty
        sx={{
          position: "absolute",
          top: 65, // Move the icon 15px lower (was 35px, now 50px)
          right: 25,
          opacity: isRequestBodyHovered ? 1 : 0,
          zIndex: 10, // Ensure the button stays above other elements
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <AutoFixHigh />
      </IconButton>

      {/* Request Body Text Area */}
      <TextField
        value={requestBody} // Use requestBody directly
        onChange={handleRequestBodyChange}
        fullWidth
        multiline
        minRows={4} // Adjusted rows for compact height
        sx={{
          maxHeight: 130, // Adjusted height
          overflow: "auto", // Enable scrolling when content overflows
          position: "relative",
        }}
        error={!isJsonValid} // Apply error styling if JSON is invalid
        helperText={!isJsonValid ? "Invalid JSON format" : ""} // Display error message
      />
    </Box>
  );
};

export default LandingPageRequestBodySection;
