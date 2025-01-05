import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import CurlDetailsAgentQuery from "./MiddlePane/CurlDetailsAgentQuery";
import ResponseGenerator from "./RightPane/ResponseGenerator";
import LeftPaneRoot from "./LeftPane/LeftPaneRoot";

const LandingPage: React.FC = () => {
  const [jsonError, setJsonError] = useState<boolean>(false);
  const [rows, setRows] = useState<{ key: string; value: string }[]>([]);
  const [requestMethod, setRequestMethod] = useState<string>("GET"); // Empty string for request method
  const [requestUrl, setRequestUrl] = useState<string>(""); // Empty string for request URL
  const [requestHeaders, setRequestHeaders] = useState<string>(""); // Empty string for request headers
  const [requestBody, setRequestBody] = useState<string>(""); // Empty string for request body
  const [expectedStatusCode, setExpectedStatusCode] = useState<number>(0); // Null for expected status code initially
  const [promptresponseData, setpromptresponseData] = useState<any>(null); // State to store response data
  const [headers, setHeaders] = useState<string>(
    '{"Content-Type": "application/json"}'
  ); // JSON string for headers
  const [jsonViewer, setJsonViewer] = useState<boolean>(false);
  const [isHeadersHovered, setIsHeadersHovered] = useState<boolean>(false);
  const [isBodyHovered, setIsBodyHovered] = useState<boolean>(false);
  const [responseBody, setResponseBody] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [promptLoading, setPromptLoading] = useState(false); // Loading state
  const [loadingComplete, setLoadingComplete] = useState(false); // Flag to track when loading is complete
  const [cachedActual, setCachedActual] = useState<string>("");

  // Handlers for each field

  const handleRequestMethodChange = (value: string) => {
    console.log("Request Method Changed: ", value); // Log request method change
    setRequestMethod(value);
  };

  const handleRequestUrlChange = (value: string) => {
    console.log("Request URL Changed: ", value); // Log request URL change
    setRequestUrl(value);
  };

  const handleRequestHeadersChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value; // Get value from input
    console.log("Request Headers Changed: ", value); // Log request headers change
    setRequestHeaders(value);

    if (value.trim() === "") {
      setJsonError(false);
      setRows([]);
      return;
    }

    try {
      const parsed = JSON.parse(value); // Try to parse the JSON
      setJsonError(false);
    } catch {
      setJsonError(true);
    }
  };

  const addRow = () => {
    setRows([...rows, { key: "", value: "" }]); // Initialize row with key and value
  };

  const deleteRow = (index: number) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  const handleKeyChange = (index: number, newKey: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], key: newKey }; // Ensure proper key update
    setRows(updatedRows);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], value: newValue }; // Ensure proper value update
    setRows(updatedRows);
  };

  const handleRequestBodyChange = (value: string) => {
    console.log("Request Body Changed: ", value); // Log request body change
    setRequestBody(value);
  };

  const handleExpectedStatusCodeChange = (value: number) => {
    console.log("Expected Status Code Changed: ", value); // Log expected status code change
    setExpectedStatusCode(value);
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeaders(value);

    if (value.trim() === "") {
      setJsonError(false);
      setRows([]);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      setJsonError(false);
    } catch {
      setJsonError(true);
    }
  };

  const handleBeautify = () => {
    if (!headers.trim()) return;

    try {
      const parsedJson = JSON.parse(headers);
      const beautifiedJson = JSON.stringify(parsedJson, null, 2);
      setHeaders(beautifiedJson);
      setJsonError(false);
    } catch (error) {
      setJsonError(true);
    }
  };

  return (
    <Box
      display="flex"
      p={2}
      gap={2}
      sx={{
        border: "1px solid #ddd", // Add a border
        borderRadius: "4px", // Optional: Rounded corners
        height: "80vh",
        width: "94%", // Set the desired height
        overflowY: "auto", // Handle overflow
      }}
    >
      {/* Left Section */}
      <LeftPaneRoot
        jsonError={jsonError}
        rows={rows}
        requestMethod={requestMethod}
        requestUrl={requestUrl}
        onRequestMethodChange={handleRequestMethodChange}
        onRequestUrlChange={handleRequestUrlChange}
        requestHeaders={requestHeaders} // Pass requestHeaders
        handleRequestHeadersChange={handleRequestHeadersChange} // Pass the handler for requestHeaders
        requestBody={requestBody} // Pass requestBody
        onRequestBodyChange={handleRequestBodyChange} // Pass the handler for requestBody
        handleKeyChange={handleKeyChange}
        handleValueChange={handleValueChange}
        deleteRow={deleteRow}
        addRow={addRow}
        setRows={setRows}
        headers={headers}
        isHeadersHovered={isHeadersHovered}
        setIsHeadersHovered={setIsHeadersHovered}
        jsonViewer={jsonViewer}
        setJsonError={setJsonError}
        handleBeautify={handleBeautify}
        setJsonViewer={setJsonViewer}
        handleHeaderChange={handleHeaderChange}
        handleExpectedStatusCodeChange={handleExpectedStatusCodeChange}
        expectedStatusCode={expectedStatusCode}
        setResponseBody={setResponseBody}
        responseBody={responseBody}
        setLoading={setLoading}
        loading={loading}
      />
      {/* Middle Section */}
      <CurlDetailsAgentQuery
        requestMethod={requestMethod}
        requestUrl={requestUrl}
        requestHeaders={requestHeaders}
        headers={headers}
        setExpectedStatusCode={setExpectedStatusCode}
        requestBody={requestBody}
        expectedStatusCode={expectedStatusCode}
        responseBody={responseBody}
        loading={loading}
        setpromptresponseData={setpromptresponseData}
        setPromptLoading={setPromptLoading}
        setLoadingComplete={setLoadingComplete}
        setCachedActual={setCachedActual}
      />
      {/* Right Section */}
      <ResponseGenerator
        promptLoading={promptLoading}
        promptresponseData={promptresponseData}
        cachedActual={cachedActual}
      />
    </Box>
  );
};

export default LandingPage;
