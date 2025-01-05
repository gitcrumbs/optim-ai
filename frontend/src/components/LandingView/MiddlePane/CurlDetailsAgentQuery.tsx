import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

interface CurlDetailsAgentQueryProps {
  requestMethod: string;
  requestUrl: string;
  requestHeaders: string;
  requestBody: string;
  expectedStatusCode: number;
  headers: string;
  responseBody: any;
  loading: boolean;
  setExpectedStatusCode: (value: number) => void;
  setpromptresponseData: (value: any) => void;
  setPromptLoading: (value: boolean) => void;
  setLoadingComplete: (value: boolean) => void;
  setCachedActual: (value: string) => void;
}

const CurlDetailsAgentQuery: React.FC<CurlDetailsAgentQueryProps> = ({
  requestMethod,
  requestUrl,
  requestHeaders,
  requestBody,
  setExpectedStatusCode,
  expectedStatusCode,
  headers,
  responseBody,
  loading,
  setpromptresponseData,
  setPromptLoading,
  setLoadingComplete,
  setCachedActual,
}) => {
  const [curlDetails, setCurlDetails] = useState<string>("");
  const [agentQuery, setAgentQuery] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");

  // Handle the Generate button click
  const handleGenerateClick = async () => {
    const backendUrl =
      process.env.OPTIM_AI_BACKEND_URL || "http://127.0.0.1:5000";
    const payload = {
      prompt: agentQuery,
      model: selectedModel,
    };

    try {
      setPromptLoading(true); // Set loading to true before making the request
      setLoadingComplete(false); // Set loading complete to false before making the request

      const response = await fetch(`${backendUrl}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData?.message === "Prompt found in cache.") {
          setpromptresponseData(responseData?.response);
          setCachedActual("Showing Cached Data");
        } else {
          setpromptresponseData(responseData);
          setCachedActual("Showing Open AI Agent Response");
        }
      }
    } catch (error) {
      console.error("Error making request:", error);
    } finally {
      setPromptLoading(false); // Set loading to false after request is completed
      setLoadingComplete(true); // Set loading complete to true after data is processed
    }
  };

  useEffect(() => {
    setExpectedStatusCode(expectedStatusCode);
  }, [expectedStatusCode]);

  useEffect(() => {
    // Only generate curl command and agent query if URL exists
    if (requestUrl) {
      generateCurlCommand();
    } else {
      setCurlDetails(""); // Clear curl details
      setAgentQuery(""); // Clear agent query
    }
  }, [
    loading,
    requestMethod,
    requestUrl,
    requestHeaders,
    requestBody,
    expectedStatusCode,
    headers,
    responseBody,
  ]);

  useEffect(() => {
    if (curlDetails) {
      generateAgentQuery(); // Generate query only if there is data in curlDetails
    } else {
      setAgentQuery(""); // Clear agent query when curlDetails is empty
    }
  }, [curlDetails]);

  // Generate curl command for the API request
  const generateCurlCommand = () => {
    let curlCommand = `curl -X ${requestMethod} ${requestUrl}`;

    // Check if either requestHeaders or headers have values and append them to the curl command
    const headersToUse = requestHeaders || headers; // Use requestHeaders if available, else fall back to headers

    if (headersToUse) {
      const headersArray = headersToUse.split("\n");
      headersArray.forEach((header) => {
        curlCommand += ` -H "${header.trim()}"`;
      });
    }

    // If body exists, append it to the curl command
    if (requestBody) {
      curlCommand += ` -d '${requestBody}'`; // Don't trim the requestBody
    }

    // Append expectedStatusCode as a comment (just for clarity)
    if (expectedStatusCode) {
      curlCommand += ` # Expected Status Code: ${expectedStatusCode}`;
    }

    // Log the responseBody in the console for debugging purposes
    logResponseBody(responseBody);

    // Append responseBody as a comment (just for clarity or debugging purposes)
    if (responseBody) {
      curlCommand += ` # Response Body: ${JSON.stringify(responseBody)}`; // Limit length to avoid excessive text
    }

    // Update the curlDetails state with the generated curl command
    setCurlDetails(curlCommand); // No trimming of data here
  };

  // Method to log the responseBody to the console
  const logResponseBody = (responseBody: any) => {
    console.log("Response Body Log:");
    console.log(JSON.stringify(responseBody, null, 2)); // This logs the entire responseBody object, formatted for readability
  };

  // Generate agent query based on the API request details
  const generateAgentQuery = () => {
    if (!requestUrl) return; // Do not generate if there's no URL

    // Start with the basic formatted query
    let formattedQuery = `Generate all possible test cases for the following API request:\n\nHTTP Method: ${requestMethod}\nURL: ${requestUrl}\nHeaders:\n${formatHeaders(requestHeaders || headers)}\nPayload:\n${requestBody ? formatPayload(requestBody) : "{}"}\n\nTest Case Requirements:\n1. Verify the status code for valid and invalid requests.\n2. Validate the response headers (e.g., Content-Type).\n3. Assert the JSON response body matches the expected structure.\n4. Test edge cases such as missing or incorrect parameters.\n5. Include scenarios for unauthorized access, if applicable.\n\nProvide test cases in a structured format with clear steps, expected results, and example data.`;

    // Only include response body if it exists
    if (responseBody) {
      formattedQuery += `\n\n Here is the Response Body:\n${JSON.stringify(responseBody, null, 2)}`;
    }

    // Add expected status code to the agent query
    if (expectedStatusCode > 0) {
      formattedQuery += `\n\n and for this specific test I Expected Status Code: ${expectedStatusCode}`;
    }

    // Set the agentQuery state with the formatted string
    setAgentQuery(formattedQuery);
  };

  // Format headers for display
  const formatHeaders = (headers: string) => {
    return headers
      .split("\n")
      .map((header) => `  - ${header.trim()}`)
      .join("\n");
  };

  // Format payload (requestBody) for display
  const formatPayload = (payload: string) => {
    try {
      const parsedPayload = JSON.parse(payload);
      return JSON.stringify(parsedPayload, null, 2); // Format the payload with indentation
    } catch (error) {
      return "{}"; // Return empty object if payload is not valid JSON
    }
  };

  // Check if either curlDetails or agentQuery are empty
  const isGenerateDisabled = !curlDetails || !agentQuery;

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        maxWidth: "30%",
        borderRight: "1px solid #ddd", // Vertical separator
        paddingRight: 2,
      }}
    >
      {/* Curl Details */}
      <Box>
        <Typography variant="h6">Curl Details</Typography>
        <TextField
          value={curlDetails}
          onChange={(e) => setCurlDetails(e.target.value)} // Keep the data intact, no trimming
          fullWidth
          multiline
          minRows={4}
          sx={{
            maxHeight: 150, // Fixed height
            overflowY: "auto", // Enables scroll when content overflows
            borderBottom: "1px solid #ccc", // Ensures bottom border visibility
          }}
        />
      </Box>

      {/* Agent Query */}
      <Box>
        <Typography variant="h6">Agent Query</Typography>
        <Typography variant="caption" color="textSecondary">
          * Clicking on Generate will send the Query to the OpenAI service
        </Typography>

        {/* Text Area for Agent Query */}
        <TextField
          value={agentQuery}
          onChange={(e) => setAgentQuery(e.target.value)}
          fullWidth
          multiline
          minRows={12}
          placeholder="Enter or review the agent query here..."
          sx={{
            marginTop: 1,
            maxHeight: 260, // Fixed height
            overflowY: "auto", // Show scrollbar if content overflows
            borderBottom: "1px solid #ccc", // Ensures bottom border visibility
          }}
        />

        {/* Dropdown and Button */}
        <Box display="flex" gap={2} mt={2} alignItems="center">
          <FormControl fullWidth sx={{ marginTop: "8px" }}>
            <InputLabel>OpenAI Model</InputLabel>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)} // Update selectedModel
            >
              <MenuItem value="gpt-4o">GPT-4o</MenuItem>
              <MenuItem value="gpt-3.5">GPT-3.5</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleGenerateClick}
            sx={{ marginTop: "8px" }}
            disabled={isGenerateDisabled} // Disable button if fields are empty
          >
            Generate
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CurlDetailsAgentQuery;
