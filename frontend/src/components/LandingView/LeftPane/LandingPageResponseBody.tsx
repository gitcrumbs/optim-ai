import React from "react";
import { Box, Typography } from "@mui/material";

// Define props type
interface LandingPageResponseBodyProps {
  responseBody: string;
  actualStatusCode: number;
}

const LandingPageResponseBody: React.FC<LandingPageResponseBodyProps> = ({
  responseBody,
  actualStatusCode,
}) => {
  // Format JSON data for better display
  const formatJson = (data: any): string => {
    try {
      // If it's an object, convert it to a pretty-printed JSON string
      return typeof data === "object" ? JSON.stringify(data, null, 2) : data; // If it's not an object, return it as is
    } catch {
      return data; // If not valid JSON, return the original data
    }
  };

  // Hide the entire section if actualStatusCode is 0
  if (actualStatusCode === 0) {
    return null;
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header Section with Status Code */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="subtitle2">Response Body</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                actualStatusCode >= 200 && actualStatusCode < 400
                  ? "#3DED97"
                  : actualStatusCode >= 400 && actualStatusCode < 500
                    ? "orange"
                    : "red",
            }}
          />
          <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
            Received Status Code: {actualStatusCode}
          </Typography>
        </Box>
      </Box>

      {/* Response Body Section */}
      <Box
        sx={{
          maxHeight: 180,
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
          padding: 2,
          borderRadius: "4px",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          border: "1px solid #ddd",
        }}
      >
        <Typography
          component="pre"
          sx={{
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
            fontSize: "14px",
          }}
        >
          {formatJson(responseBody)}
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPageResponseBody;
