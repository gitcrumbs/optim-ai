// ResizeObserverComponent.tsx
import React, { useEffect } from "react";

const ResizeObserverComponent: React.FC = () => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      console.log("Window resized");
      // Add any resize-related logic here
    });

    // Observe the whole document or a specific element
    resizeObserver.observe(document.body); // Or any specific element

    return () => {
      resizeObserver.disconnect(); // Clean up observer
    };
  }, []);

  return null; // This component doesn't need to render anything
};

export default ResizeObserverComponent;
