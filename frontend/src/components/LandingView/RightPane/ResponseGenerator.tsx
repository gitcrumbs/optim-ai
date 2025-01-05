import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { JsonViewer } from "@textea/json-viewer"; // Import JsonViewer from @textea/json-viewer

interface ResponseGeneratorProps {
  promptresponseData: any;
  promptLoading: boolean;
  cachedActual: string;
}

const ResponseGenerator: React.FC<ResponseGeneratorProps> = ({
  promptresponseData,
  promptLoading,
  cachedActual,
}) => {
  // Normalize response
  const formatResponse = (response: any) => {
    if (!response) return "No response body";

    if (typeof response === "string") {
      // If the response is a string, try parsing as JSON
      try {
        const parsedResponse = JSON.parse(response);
        return parsedResponse;
      } catch (error) {
        return response;
      }
    }

    // Return the response directly if it's already an object or array
    return response;
  };

  console.log("promptresponseData", promptresponseData);
  const formattedResponse = formatResponse(promptresponseData);

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        maxWidth: "30%",
        paddingLeft: 2,
      }}
    >
      <Typography variant="h6">
        Agent Response
        <Typography variant="h6" align="right">
          {cachedActual}
        </Typography>{" "}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "92vh", // Set fixed height here (adjust as needed)
          padding: 2,
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontFamily: "monospace", // Typewriter feel
          fontSize: "14px",
          whiteSpace: "pre-wrap", // Preserve JSON formatting
          wordWrap: "break-word", // Ensure long words wrap
        }}
      >
        {promptLoading ? (
          // Show Skeletons while loading
          <div>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height="60vh" />
          </div>
        ) : formattedResponse ? (
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            {/* Render JSON using JsonViewer from @textea/json-viewer */}
            <JsonViewer value={formattedResponse} />
          </div>
        ) : (
          "Use Agent Query and Click Generate to show Response"
        )}
      </Box>
    </Box>
  );
};

export default ResponseGenerator;
