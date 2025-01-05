import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatComponent from "./ChatComponent";
import LoggerComponent from "../LogFactory/LoggerComponent";
import QueryResponseLogger from "./QueryResponseLogger";

const QueryBot: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);

  const [config, setConfig] = useState<{ [key: string]: string }>({
    apiUrl: "",
    apiKey: "",
    timeout: "30",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
  };

  const [systemAnalysis, setSystemAnalysis] = useState<string>("");

  // Callback function to update system analysis
  const handleSystemAnalysisUpdate = (analysis: string) => {
    setSystemAnalysis(analysis);
  };

  return (
    <div className="app-container">
      <div className={`left-panel ${chatOpen ? "chat-open" : ""}`}>
        <div className="chat-panel">
          {chatOpen && (
            <>
              <IconButton
                aria-label="collapse chat"
                onClick={toggleChat}
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <CloseIcon />
              </IconButton>
              <ChatComponent
                onSystemAnalysisUpdate={handleSystemAnalysisUpdate}
              />
            </>
          )}
        </div>
      </div>
      <div className="center-content">
        <Paper
          elevation={3}
          className="query-bot-logs"
          style={{ padding: "1px" }}
        >
          <p>
            Gain insights from your generated logs using <strong>OpenAI</strong>
            . Interact with your logs conversationally and analyze them
            effortlessly with the power of <strong>OpenAI's API</strong>.
          </p>
        </Paper>
        <div className="query-log-response">
          <QueryResponseLogger systemAnalysis={systemAnalysis} />{" "}
          {/* Pass chatOpen prop */}
        </div>
      </div>
      {!chatOpen && (
        <Fab
          color="primary"
          aria-label="open chat"
          onClick={toggleChat}
          style={{ position: "fixed", left: 16, bottom: 16 }}
        >
          {chatOpen ? <CloseIcon /> : <SmartToyIcon />}
        </Fab>
      )}
    </div>
  );
};

export default QueryBot;
