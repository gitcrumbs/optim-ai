import React from "react";

interface HeadersTableViewProps {
  jsonData: string;
}

const HeadersTableView: React.FC<HeadersTableViewProps> = ({ jsonData }) => {
  let parsedData;
  try {
    parsedData = JSON.parse(jsonData); // Parse the JSON string
  } catch (e) {
    return <div>Invalid JSON</div>; // Return error if JSON is invalid
  }

  // Render a simple table if valid JSON
  const renderTable = (jsonData: any) => {
    const keys = Object.keys(jsonData);

    if (keys.length === 0) {
      // If no keys, display a table with empty key-value pairs
      return (
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      );
    }

    return (
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {keys.map((key) => (
              <td key={key}>{jsonData[key]}</td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div>
      {parsedData &&
      typeof parsedData === "object" &&
      !Array.isArray(parsedData) ? (
        renderTable(parsedData)
      ) : (
        <div>Invalid JSON format for table view</div>
      )}
    </div>
  );
};

export default HeadersTableView;
