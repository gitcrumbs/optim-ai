import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import Send from "@mui/icons-material/Send";
import HeadersSection from "./HeadersSection";
import LandingPageRequestBodySection from "./LandingPageRequestBodySection";
import LandingPageResponseBody from "./LandingPageResponseBody";

interface LeftPaneRootProps {
  requestMethod: string;
  requestUrl: string;
  onRequestMethodChange: (value: string) => void;
  onRequestUrlChange: (value: string) => void;
  requestHeaders: string;
  handleRequestHeadersChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestBodyChange: (value: string) => void;
  jsonError: boolean;
  jsonViewer: any;
  rows: any[];
  headers: string;
  addRow: () => void;
  setRows: (value: any[]) => void;
  handleKeyChange: (index: number, newKey: string) => void;
  handleValueChange: (index: number, newValue: string) => void;
  deleteRow: (index: number) => void;
  isHeadersHovered: boolean;
  setIsHeadersHovered: (value: boolean) => void;
  requestBody: string;
  setJsonError: (value: boolean) => void;
  handleBeautify: () => void;
  setJsonViewer: (value: any) => void;
  handleHeaderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpectedStatusCodeChange: (value: number) => void;
  expectedStatusCode: number;
  setResponseBody: (value: any) => void;
  responseBody: any;
  setLoading: (value: boolean) => void;
  loading: boolean;
}

const LeftPaneRoot: React.FC<LeftPaneRootProps> = ({
  requestMethod,
  requestUrl,
  onRequestMethodChange,
  onRequestUrlChange,
  requestHeaders,
  handleRequestHeadersChange,
  requestBody,
  onRequestBodyChange,
  jsonError,
  jsonViewer,
  setJsonError,
  rows,
  addRow,
  setRows,
  handleKeyChange,
  handleValueChange,
  deleteRow,
  isHeadersHovered,
  setIsHeadersHovered,
  handleBeautify,
  setJsonViewer,
  handleHeaderChange,
  headers,
  handleExpectedStatusCodeChange,
  expectedStatusCode,
  setResponseBody,
  responseBody,
  setLoading,
  loading,
}) => {
  const [requestType, setRequestType] = useState<string>(requestMethod);
  const [loadeddata, setLoadedData] = useState<any>(null);
  const [actualStatusCode, setActualStatusCode] = useState<number>(0);

  useEffect(() => {
    setRequestType(requestMethod);
  }, [requestMethod]);

  // Handle Method Change
  const handleRequestMethodChange = (value: string) => {
    setRequestType(value);
    onRequestMethodChange(value);
  };

  // Handle URL Change
  const handleRequestUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    onRequestUrlChange(url);
  };

  // Handle Send Request
  const handleSendRequest = async () => {
    if (!requestUrl) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      setLoading(true);

      // Parse headers and body safely
      let headersObj = {};
      let body: string | null = null;

      try {
        headersObj = requestHeaders ? JSON.parse(requestHeaders) : {};
      } catch (parseError) {
        throw new Error("Invalid headers format. Ensure it is valid JSON.");
      }

      try {
        body = requestBody ? JSON.stringify(JSON.parse(requestBody)) : null;
      } catch (parseError) {
        throw new Error(
          "Invalid request body format. Ensure it is valid JSON."
        );
      }

      // Make the fetch call
      const response = await fetch(requestUrl, {
        method: requestType,
        headers: headersObj,
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResponseBody(data); // Set the response to be displayed
      setLoadedData(data);
      setActualStatusCode(response.status);
    } catch (error) {
      console.error("Error sending request:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setResponseBody({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        maxWidth: "30%",
        borderRight: "1px solid #ddd",
        paddingRight: 2,
      }}
    >
      <Box display="flex" gap={2} alignItems="center">
        <FormControl sx={{ minWidth: 90 }}>
          <Select
            value={requestType}
            onChange={(e) =>
              handleRequestMethodChange(e.target.value as string)
            }
            sx={{
              height: 36,
              "& .MuiSelect-select": {
                padding: "8px",
              },
            }}
          >
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TextField
            fullWidth
            variant="outlined"
            sx={{
              height: 36,
              input: {
                padding: "8px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#aaa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4C6E6C",
                },
              },
            }}
            value={requestUrl}
            onChange={handleRequestUrlChange}
            placeholder="Enter URL"
          />
          <IconButton
            color="primary"
            aria-label="send"
            size="large"
            sx={{ marginLeft: 1 }}
            onClick={handleSendRequest}
            disabled={loading} // Disable while loading
          >
            <Send />
          </IconButton>
        </Box>
      </Box>

      <HeadersSection
        {...{
          jsonError,
          rows,
          requestHeaders,
          handleRequestHeadersChange,
          handleKeyChange,
          handleValueChange,
          setJsonError,
          jsonViewer,
          deleteRow,
          addRow,
          setRows,
          isHeadersHovered,
          setIsHeadersHovered,
          handleBeautify,
          setJsonViewer,
          handleHeaderChange,
          headers,
        }}
      />

      <LandingPageRequestBodySection
        {...{
          requestBody,
          onRequestBodyChange,
          handleExpectedStatusCodeChange,
          expectedStatusCode: expectedStatusCode ?? 200,
        }}
      />

      <LandingPageResponseBody
        responseBody={responseBody}
        actualStatusCode={actualStatusCode}
      />
    </Box>
  );
};

export default LeftPaneRoot;
