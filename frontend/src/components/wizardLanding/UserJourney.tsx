import React, { useState } from "react";
import {
  Box,
  TextField,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import {
  FileCopy as FileCopyIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import LandingPage from "../LandingView/LandingPage";
import ShowResponse from "../ResponseView/ShowResponse";
import TabPanel from "./TabPanel";
import QueryBot from "../QueryLogChatbot/QueryBot";
import { blue } from "@mui/material/colors";

const UserJourney: React.FC = () => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    step1: "",
    step2: "",
    step3: "",
  });
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "97%", p: 2 }}>
      <Typography variant="h6" gutterBottom style={{ color: blue[500] }}>
        Optim AI Test Suite Generator{" "}
        <span role="img" aria-label="Friendly Bot">
          🤖
        </span>
      </Typography>

      {/* Tabs with Wrapped Labels */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="wrapped label tabs example"
      >
        <Tab label="Generate Test Suites using Open AI Agent" />
        <Tab label="Launch Bots" />
        <Tab label=" Open AI as Monitoring Assistant" />
      </Tabs>

      {tabIndex === 0 && <LandingPage />}
      {tabIndex === 1 && <ShowResponse />}
      {tabIndex === 2 && <QueryBot />}
    </Box>
  );
};

export default UserJourney;
