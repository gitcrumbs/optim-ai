import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ApiConfigurationProps {
  suite: any;
}
const ApiConfiguration: React.FC<ApiConfigurationProps> = ({ suite }) => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
  const [tabIndex, setTabIndex] = useState(0);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Add a new key-value pair
  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "" }]);
  };

  // Update key-value pair
  const updateQueryParam = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedParams = [...queryParams];
    updatedParams[index][field] = value;
    setQueryParams(updatedParams);
  };

  // Delete a key-value pair
  const deleteQueryParam = (index: number) => {
    const updatedParams = queryParams.filter((_, i) => i !== index);
    setQueryParams(updatedParams);
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        API Configuration
      </Typography>

      {/* HTTP Method and URL Input */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <TextField
            select
            label="Method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            fullWidth
          >
            {["GET", "POST", "PUT", "DELETE", "PATCH"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={10}>
          <TextField
            label="API URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Tabs for Config Sections */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        style={{ marginTop: 16 }}
      >
        <Tab label="URL Query" />
        <Tab label="Body" />
        <Tab label="Headers" />
        <Tab label="Response" />
        <Tab label="Transform" />
      </Tabs>

      {/* Tab Panels */}
      <div style={{ marginTop: 16 }}>
        {tabIndex === 0 && (
          <Grid container spacing={2}>
            {queryParams.map((param, index) => (
              <Grid container item spacing={1} key={index} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Key"
                    variant="outlined"
                    fullWidth
                    value={param.key}
                    onChange={(e) =>
                      updateQueryParam(index, "key", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Value"
                    variant="outlined"
                    fullWidth
                    value={param.value}
                    onChange={(e) =>
                      updateQueryParam(index, "value", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => deleteQueryParam(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="outlined" onClick={addQueryParam}>
                + Add Query Parameter
              </Button>
            </Grid>
          </Grid>
        )}
        {tabIndex === 1 && <div>Body Configuration Goes Here</div>}
        {tabIndex === 2 && <div>Headers Configuration Goes Here</div>}
        {tabIndex === 3 && <div>Response Configuration Goes Here</div>}
      </div>
    </Paper>
  );
};

export default ApiConfiguration;
