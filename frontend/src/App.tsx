import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ResizeObserverComponent from "./components/ResizeObserverComponent"; // Import the ResizeObserverComponent
import UserJourney from "./components/wizardLanding/UserJourney";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const App: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <Router>
      <ResizeObserverComponent />
      <Routes>
        <Route path="/" element={<UserJourney />} />
      </Routes>
    </Router>
  );
};

export default App;
