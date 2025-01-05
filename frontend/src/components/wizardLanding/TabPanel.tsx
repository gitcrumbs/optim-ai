import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ConfiguredSuiteTable from "./ConfiguredSuiteTable";
import ApiConfiguration from "./ApiConfiguration";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabsWrappedLabel() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const suites = [
    {
      id: 1,
      testName: "Suite 1",
      numberOfApiSteps: 5,
      lastExecutedOn: "2023-10-01",
      lastExecutedBy: "Manual",
      status: "Pending",
    },
    {
      id: 2,
      testName: "Suite 2",
      numberOfApiSteps: 3,
      lastExecutedOn: "2023-10-02",
      lastExecutedBy: "Service",
      status: "Running",
    },
    {
      id: 3,
      testName: "Suite 3",
      numberOfApiSteps: 7,
      lastExecutedOn: "2023-10-03",
      lastExecutedBy: "Manual",
      status: "Failed",
    },
    {
      id: 4,
      testName: "Suite 4",
      numberOfApiSteps: 2,
      lastExecutedOn: "2023-10-04",
      lastExecutedBy: "Service",
      status: "Passed",
    },
  ];

  const handleSaveConfig = (config: { [key: string]: string }) => {
    console.log("Configuration saved:", config);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          <Tab
            value={0}
            label="Create Test Suites using Generative AI"
            wrapped
            {...a11yProps(0)}
          />
          <Tab value={1} label="Configure API Step" {...a11yProps(1)} />
          <Tab
            value={2}
            label="View Configured Test Suites"
            {...a11yProps(2)}
          />
          <Tab value={3} label="View Execution Summary" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}></TabPanel>
      <TabPanel value={value} index={1}>
        <ApiConfiguration suite={suites[0]} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>View Configured Test Suites</Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography>View Execution Summary</Typography>
        <ConfiguredSuiteTable suites={suites} />
      </TabPanel>
    </Box>
  );
}
