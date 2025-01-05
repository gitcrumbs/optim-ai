import React, { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    eventSourceMap?: Map<string, EventSource>;
  }
}
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LoopIcon from "@mui/icons-material/Loop";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import CachedIcon from "@mui/icons-material/Cached";

const streamurl = process.env.OPTIM_AI_STREAM_URL || "http://127.0.0.1:5003";

interface ExecutionStatusProps {
  testCase: {
    status: "pending" | "processing" | "completed" | "error" | "noJobsActive";
    prompt_hash: string;
    tc_hash: string;
  };
  clickedTestCase?: { prompt_hash: string; tc_hash: string } | null; // updated to match testCase structure
}

const statusIconMap = {
  pending: <HourglassEmptyIcon style={{ color: "orange" }} />,
  processing: <LoopIcon style={{ color: "blue" }} />,
  completed: <CheckCircleIcon style={{ color: "green" }} />,
  error: <ErrorIcon style={{ color: "red" }} />,
  noJobsActive: <LocalCafeIcon style={{ color: "teal" }} />,
  retry: <CachedIcon style={{ color: "grey" }} />,
};

const statusTextMap = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  error: "Error",
  retry: "Entered Retry",
  noJobsActive: "No Jobs Active",
};

const ExecutionStatus: React.FC<ExecutionStatusProps> = ({
  testCase,
  clickedTestCase,
}) => {
  const [status, setStatus] = useState(testCase.status);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Store clickedTestCase in local storage
    if (clickedTestCase) {
      localStorage.setItem("clickedTestCase", JSON.stringify(clickedTestCase));
    }

    // Retrieve clickedTestCase from local storage if not provided
    const storedClickedTestCase = localStorage.getItem("clickedTestCase");
    const parsedClickedTestCase = storedClickedTestCase
      ? JSON.parse(storedClickedTestCase)
      : null;

    const activeClickedTestCase = clickedTestCase || parsedClickedTestCase;

    if (
      activeClickedTestCase?.prompt_hash === testCase.prompt_hash &&
      activeClickedTestCase.tc_hash === testCase.tc_hash
    ) {
      const { prompt_hash, tc_hash } = testCase;
      const connectionKey = `${prompt_hash}_${tc_hash}`;

      if (!window.eventSourceMap) {
        window.eventSourceMap = new Map<string, EventSource>();
      }

      if (!window.eventSourceMap.has(connectionKey)) {
        const eventSource = new EventSource(
          `${streamurl}/job_status_stream?prompt_hash=${prompt_hash}&tc_hash=${tc_hash}`
        );

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.status) {
              setStatus(data.status);

              if (data.status === "completed") {
                eventSource.close();
                window.eventSourceMap?.delete(connectionKey);
                console.log(
                  `Connection closed for ${connectionKey} as status is completed`
                );
              }
            }
          } catch (error) {
            console.error("Error parsing EventSource message:", error);
          }
        };

        eventSource.onerror = () => {
          console.error(`EventSource error for key: ${connectionKey}`);
        };

        window.eventSourceMap.set(connectionKey, eventSource);
        eventSourceRef.current = eventSource;
      } else {
        // If the connection already exists, use the existing EventSource
        eventSourceRef.current =
          window.eventSourceMap.get(connectionKey) || null;
      }

      return () => {
        // Do not close the EventSource connection on component unmount
        // This ensures the connection remains persistent
      };
    }
  }, [testCase, clickedTestCase]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
    >
      {statusIconMap[status] || statusIconMap.noJobsActive}
      <Typography variant="body2" style={{ marginLeft: 8 }}>
        {statusTextMap[status] || statusTextMap.noJobsActive}
      </Typography>
    </Box>
  );
};

export default ExecutionStatus;
