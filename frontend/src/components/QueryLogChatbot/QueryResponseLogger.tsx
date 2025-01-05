import React, { useEffect, useState } from "react";
import "./QueryResponseLogger.css";

// Define interface for the props
interface QueryResponseLoggerProps {
  systemAnalysis: string | { Result: string; description: string }[]; // Can be either a string or an array of objects
}

const QueryResponseLogger: React.FC<QueryResponseLoggerProps> = ({
  systemAnalysis,
}) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (systemAnalysis) {
      let parsedData;

      // Check if systemAnalysis is a string (likely JSON)
      if (typeof systemAnalysis === "string") {
        try {
          parsedData = JSON.parse(systemAnalysis);
        } catch (error) {
          console.error("Error parsing systemAnalysis:", error);
          return;
        }
      } else {
        parsedData = systemAnalysis; // If it's already an object, no need to parse
      }

      // Check if parsedData is an array and extract the Result
      if (Array.isArray(parsedData)) {
        setLogs(parsedData.map((entry) => `INFO: ${entry.Result}`)); // Append "INFO" in front
      }
    }
  }, [systemAnalysis]);

  return (
    <div className="query-botlogger-response">
      <div className="system-analysis">
        <h3>System Analysis:</h3>
        {/* Display each log */}
        {logs.length > 0 ? (
          logs.map((log, index) => <p key={index}>{log}</p>)
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default QueryResponseLogger;
