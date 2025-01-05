import React, { useEffect, useState, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import "./LoggerComponent.css";
import CloseIcon from "@mui/icons-material/Close";

declare global {
  interface Window {
    eventSourceMap?: Map<string, EventSource>;
  }
}

interface LoggerComponentProps {
  prompt_hash: string;
  tc_hash: string;
  open: boolean;
  onClose: () => void;
}

const streamurl =
  process.env.OPTIM_AI_LOG_STREAM_URL || "http://127.0.0.1:5004";

const LoggerComponent: React.FC<LoggerComponentProps> = ({
  prompt_hash,
  tc_hash,
  open,
  onClose,
}) => {
  const [logs, setLogs] = useState<{ message: string; level: string }[]>([]);
  const [serverStatus, setServerStatus] = useState<string>("offline");
  const [buttonBlink, setButtonBlink] = useState<boolean>(false); // Track blink state
  const eventSourceRef = useRef<EventSource | null>(null);
  const errorLoggedRef = useRef<boolean>(false); // Prevents multiple error logs
  const [noLogsCount, setNoLogsCount] = useState<number>(0); // Track frequency of "No logs available"
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout reference for heartbeat

  useEffect(() => {
    if (!open) {
      return; // Do not initiate a connection if the modal is not open
    }

    const connectionKey = `log_${prompt_hash}_${tc_hash}`;

    if (!window.eventSourceMap) {
      window.eventSourceMap = new Map<string, EventSource>();
    }

    if (!window.eventSourceMap.has(connectionKey)) {
      const createEventSource = () => {
        const eventSource = new EventSource(
          `${streamurl}/log_stream?prompt_hash=${prompt_hash}&tc_hash=${tc_hash}`
        );

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle the heartbeat message
            if (data.message === "heartbeat") {
              setServerStatus("online");
              setNoLogsCount(0); // Reset counter when heartbeat is received

              // Clear any existing timeout and set a new one for heartbeat inactivity
              if (heartbeatTimeoutRef.current) {
                clearTimeout(heartbeatTimeoutRef.current);
              }

              heartbeatTimeoutRef.current = setTimeout(() => {
                setServerStatus("offline");
              }, 10000); // Set timeout for 10 seconds after last heartbeat

              return;
            }

            // Handle the "No logs available" message
            if (data.message === "No logs available at the moment") {
              setServerStatus("online");
              setNoLogsCount((prevCount) => prevCount + 1);

              // Change status to "Online" with yellow indicator if received frequently
              if (noLogsCount > 3) {
                setServerStatus("noLogs"); // Yellow indicator for frequent "No logs"
              }
            } else if (data?.message) {
              setLogs((prevLogs) => {
                const level = data.level || "info"; // Default to "info" if no level is provided
                setButtonBlink(true); // Start blinking on new log
                return [
                  ...prevLogs,
                  {
                    message: `${level.toUpperCase()} : ${data.message}`,
                    level,
                  },
                ];
              });
              setServerStatus("streaming");
              setNoLogsCount(0); // Reset the "No logs available" count
            }
          } catch (error) {
            console.error("Error parsing EventSource message:", error);
          }
        };

        eventSource.onerror = () => {
          if (!errorLoggedRef.current) {
            setLogs((prevLogs) => [
              ...prevLogs,
              {
                message:
                  "Error: Unable to connect to log stream. Please check your server.",
                level: "error",
              },
            ]);
            errorLoggedRef.current = true; // Mark error as logged
          }

          // Retry logic for temporary issues
          setTimeout(() => {
            console.log(`Retrying connection for key: ${connectionKey}...`);
            window.eventSourceMap?.delete(connectionKey);
            createEventSource();
          }, 20000); // Retry after 20 seconds
        };

        window.eventSourceMap?.set(connectionKey, eventSource);
        eventSourceRef.current = eventSource;
      };

      createEventSource();
    } else {
      eventSourceRef.current = window.eventSourceMap.get(connectionKey) || null;
    }

    return () => {
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        window.eventSourceMap?.delete(connectionKey);
        eventSourceRef.current = null;
      }
    };
  }, [open, prompt_hash, tc_hash, noLogsCount]);

  useEffect(() => {
    // Reset the blinking button after a delay
    if (buttonBlink) {
      const blinkTimeout = setTimeout(() => {
        setButtonBlink(false); // Stop blinking after 1 second
      }, 1000); // Blink for 1 second

      return () => clearTimeout(blinkTimeout);
    }
  }, [buttonBlink]);

  const getStatusColor = () => {
    switch (serverStatus) {
      case "streaming":
        return "green"; // Blinking indicator for streaming
      case "noLogs":
        return "yellow"; // Yellow for "No logs available"
      case "online":
        return "green"; // Green for online
      case "offline":
        return "gray"; // Gray for offline
      default:
        return "gray";
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box
        flex="1 1 auto"
        display="flex"
        flexDirection="column"
        overflow="auto"
        paddingBottom="50px" // Ensure there's space for the status at the bottom
      >
        <div className="logger-component" style={{ paddingBottom: 5 }}>
          {logs.map((log, index) => (
            <Typography
              key={index}
              variant="body2"
              style={{
                marginBottom: 8,
                minHeight: 16,
                whiteSpace: "pre-wrap",
                fontFamily: "Arial, sans-serif", // Retain your font family here
                fontSize: "14px", // Retain your font size here
              }}
              className="logger-status"
            >
              {log.message}
            </Typography>
          ))}
        </div>
      </Box>

      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
        sx={{ background: "#2c001e", padding: "10px" }}
        className="logger-component-status"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // Ensures vertical alignment
            width: "50%",
          }}
        >
          {/* Status Indicator */}
          <Box
            width={12}
            height={12}
            borderRadius="50%"
            sx={{
              backgroundColor: getStatusColor(),
              animation: buttonBlink
                ? "blink 0.5s step-start infinite"
                : "none", // Blinking effect
              marginLeft: "8px", // Initial small margin
            }}
          />

          {/* Typography with Gap Based on Modal Width */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              color: "white",
              marginLeft: "calc((50vw * 0.02) + 1px)", // Adjust based on modal width
            }}
          >
            {serverStatus === "noLogs"
              ? "No Logs Available"
              : serverStatus === "streaming"
                ? "Streaming"
                : serverStatus === "online"
                  ? "Online"
                  : "Offline"}
          </Typography>
        </Box>

        <Box ml={"90%"} display="flex">
          <IconButton
            onClick={onClose}
            sx={{
              color: "#ffffff", // White color for the cross icon
              // Transparent background
              "&:hover": {
                backgroundColor: "#4C6E6C", // Slight background color on hover for better interaction
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default LoggerComponent;
