import React, { useState } from "react";
import axios from "axios";
import "./QueryBot.css";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ErrorIcon from "@mui/icons-material/Error";
import CryptoJS from "crypto-js";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  isLoading?: boolean;
}

interface ChatComponentProps {
  onSystemAnalysisUpdate: (analysis: string) => void; // Callback to update the parent
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  onSystemAnalysisUpdate,
}) => {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    const userMessage: ChatMessage = { sender: "user", text: prompt };
    setChatHistory((prev) => [...prev, userMessage]);

    const botMessageLoading: ChatMessage = {
      sender: "bot",
      text: "",
      isLoading: true,
    };
    setChatHistory((prev) => [...prev, botMessageLoading]);

    setPrompt("");

    try {
      const user_promptHashforSystem = CryptoJS.SHA256(prompt).toString();
      const res = await axios.post(
        process.env.REACT_APP_OPTIM_AI_CHAT_FOR_LOGS ||
          "http://localhost:5007/testPrompt",
        {
          prompt,
          user_promptHashforSystem,
        }
      );

      const prompt_type =
        res.data?.response?.prompt_type || res.data?.prompt_type || "unknown";
      const response =
        res.data?.response?.response ||
        res.data?.response ||
        "Unexpected response format";

      let botResponseText = "";

      if (prompt_type === "system_analysis") {
        console.log("System analysis received.");
        onSystemAnalysisUpdate(response); // Pass the analysis back to parent
        botResponseText =
          "System analysis received. Updating the analysis window...";
      } else if (Array.isArray(response)) {
        // Handle array response
        botResponseText = response
          .map((item: any) => {
            // Check if the item is an object with description and Result keys
            if (item && item.description && item.Result) {
              return `${item.description}: ${item.Result}`;
            }
            return "Invalid response format.";
          })
          .join("\n\n");
      } else if (typeof response === "string") {
        botResponseText = response;
      } else if (typeof response === "object" && response !== null) {
        // Handle object response with description and result fields
        const description = response.description || "No description";
        const result = response.Result || "No result";
        botResponseText = `${description}: ${result}`;
      } else {
        botResponseText = "Unexpected response format.";
      }

      const botMessage: ChatMessage = {
        sender: "bot",
        text: botResponseText,
        isLoading: false,
      };

      setChatHistory((prev) => [...prev.slice(0, -1), botMessage]);
    } catch (error) {
      const botErrorMessage: ChatMessage = {
        sender: "bot",
        text: "Could not process that request",
        isLoading: false,
      };

      setChatHistory((prev) => [...prev.slice(0, -1), botErrorMessage]);
      setError("Error generating response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-component">
      <div className="chat-response">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              message.sender === "user" ? "user-bubble" : "bot-bubble"
            } ${message.isLoading ? "loading" : ""}`}
          >
            {message.isLoading ? (
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              message.text
                .split("\n")
                .map((line, idx) => <div key={idx}>{line}</div>)
            )}
          </div>
        ))}
      </div>
      <div className="chat-inner-container">
        {error && (
          <div className="error-icon-container">
            <IconButton className="error-icon" color="error">
              <ErrorIcon />
            </IconButton>
            <div className="error-tooltip">{error}</div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="chat-input"
          />
          <IconButton type="submit" color="primary" disabled={loading}>
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
