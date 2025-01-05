import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar,
  Skeleton,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowParams,
} from "@mui/x-data-grid";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionModal from "./DescriptionModal";
import ExecutionSummaryModal from "./ExecutionSummaryModal";
import ExecutionStatus from "./ExecutionStatus"; // Add this line to import ExecutionStatus
import CryptoJS from "crypto-js";

interface ExecutionSummary {
  summary: string;
}

interface ExpectedResult {
  status_code: number;
  headers: Record<string, string>;
  body: string;
  notes?: string;
}

interface Validation {
  jsonpath_expression: string;
  expected_value: any;
  assertion_type: string;
  validation_message: string;
}

interface TestCase {
  test_case_title: string;
  test_case_id: string;
  description: string;
  test_steps: string[];
  expected_results: {
    status_code: number | string;
    headers?: Record<string, string>;
    response_body?: Record<string, any>;
  };
  validations: Validation[];
  last_executed_on?: string;
  status?: string;
  prompt_hash: string;
}

interface ParsedTestCase extends TestCase {
  id: number;
  testId: string;
  title: string;
  steps: string[];
  expectedResults: ExpectedResult[];
  expected_results: {
    status_code: number | string;
    headers?: Record<string, string>;
    response_body?: Record<string, any>;
  };
  tc_hash: string;
}

interface Response {
  response: { test_cases: TestCase[] } | undefined;
}

const backendUrl = process.env.OPTIM_AI_BACKEND_URL || "http://127.0.0.1:5000";
const jobsurl =
  process.env.OPTIM_AI_JOBS_BACKEND_URL || "http://127.0.0.1:5001";

const fetchAllEntries = async () => {
  try {
    const response = await axios.get(`${backendUrl}/get_all_entries`);

    return response?.data;
  } catch (error) {
    console.error("Error fetching data from backend:", error);
    throw error;
  }
};

const parseEntriesToTestCases = (entries: any[]) => {
  return entries
    .map((entry, index) => {
      // Assuming each entry contains a response object, which in turn has test_cases

      const testCases = JSON.parse(entry.response)[0].test_cases.map(
        (testCase: any) => ({
          id: index * 10 + testCase.test_case_id, // Unique ID for each test case
          testId: testCase.test_case_id,
          title: testCase.test_case_title,
          description: testCase.description,
          steps: testCase.test_steps,
          expectedResults: testCase.expected_results,
          tc_hash: computeTcHash(testCase), // Assuming computeTcHash is a utility you have to generate a unique hash for each test case
        })
      );
      return testCases;
    })
    .flat(); // Flatten the array of arrays to get a single array of test cases
};

const variantColorMap: Record<string, string> = {
  success: "#4caf50", // Green
  error: "#f44336", // Red
  warning: "#ff9800", // Orange
  info: "#2196f3", // Blue
};

const ShowResponse: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] =
    useState<ParsedTestCase | null>(null);
  const [testCases, setTestCases] = useState<ParsedTestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executionSummary, setExecutionSummary] = useState<String | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const [fetchLogsforTestCase, setFetchLogsforTestCase] =
    useState<ParsedTestCase | null>();

  const [clickedTestCase, setClickedTestCase] =
    useState<ParsedTestCase | null>();
  const [page, setPage] = useState(0); // Track current page
  const [pageSize, setPageSize] = useState(0); // Track the number of items per page
  const [paginationCount, setPaginationCount] = useState<number>(0);
  const paginatedRows = testCases.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllEntries();
        console.log("Fetched data:", data); // Log the fetched data
        const parsedTestCases = parseTestCases(data?.entries);
        calculatePaginationData(
          data,
          parsedTestCases,
          setPageSize,
          setPaginationCount
        );
        setTestCases(parsedTestCases);
      } catch (error) {
        setError("Error fetching test cases");
        console.error("Error fetching test cases:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleRowClick = (params: GridRowParams) => {
    const selectedRow = testCases.find((testCase) => testCase.id === params.id);
    if (selectedRow) {
      setSelectedTestCase(selectedRow);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTestCase(null);
  };

  const handlePlayClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    const testCase = testCases.find((testCase) => testCase.id === id);
    if (!testCase) {
      setSnackbarMessage("Test case not found.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    console.log("Executing test case:", testCase);
    setClickedTestCase(testCase);
    try {
      const response = await fetch(`${jobsurl}/create_job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testCase),
      });

      if (response.ok) {
        const result = await response.json();
        setSnackbarMessage(
          `Execution Job ${result.job_id} created successfully.`
        );
        setSnackbarSeverity("success");
      } else {
        const errorResult = await response.json();
        setSnackbarMessage(`Failed to create job: ${errorResult.error}`);
        setSnackbarSeverity("error");
      }
    } catch (err) {
      console.error("Failed to create job", err);
      setSnackbarMessage("Failed to create job due to network error.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleViewSummaryClick = (event: React.MouseEvent, id: Number) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    const testCase = testCases.find((testCase) => testCase.id === id);

    console.log("Viewing Icon for test case:", testCase);
    if (!testCase) {
      setSnackbarMessage("Test case not found.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setFetchLogsforTestCase(testCase);
    const summary = {
      description: `${testCase.description}`,
    }; // Replace with actual API call

    setExecutionSummary(testCase.description);
    setSummaryOpen(true);
  };

  const handleSummaryClose = () => {
    setSummaryOpen(false);
    setExecutionSummary(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const parseTestCases = (response: any): ParsedTestCase[] => {
    // Extract the prompt hash from the response

    console.log("Response:", response);
    // Extract test cases from all entries in the response
    const allTestCases: ParsedTestCase[] = response.flatMap(
      (entry: any, entryIndex: number) => {
        const tcs = JSON.parse(entry.response);

        const parsedResponse: TestCase[] = tcs.flatMap((tc: any) => tc || []);
        console.log("Parsed Response:", parsedResponse);

        return parsedResponse.flatMap((testCase: any, index: number) => {
          const {
            test_case_title,
            test_case_id,
            description,
            test_steps,
            expected_results,
            status_code,
            validations,
            last_executed_on,
            status,
            prompt_hash = entry.prompt_hash,
            tc_hash,
          } = testCase;

          testCase.tc_hash = computeTcHash(testCase);

          // Convert expected results to the ExpectedResult format
          const expectedResults: ExpectedResult[] = [
            {
              status_code:
                typeof expected_results.status_code === "string"
                  ? parseInt(
                      expected_results.status_code.match(/\d+/)?.[0] || "0",
                      10
                    )
                  : expected_results.status_code,
              headers: expected_results.headers || {},
              body: expected_results.response_body,
            },
          ];

          return {
            ...testCase,
            id: testCase.tc_hash, // Ensure unique ID across all entries
            expectedResults,
            last_executed_on,
            status,
            prompt_hash,
          };
        });
      }
    );

    return allTestCases;
  };

  const calculatePaginationData = (
    response: any,
    allTestCases: ParsedTestCase[],
    setPageSize: React.Dispatch<React.SetStateAction<number>>,
    setPaginationCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    // Check if response and response.entries are valid

    if (
      !response ||
      !Array.isArray(response.entries) ||
      response.entries.length === 0
    ) {
      console.error("Invalid response or response.entries");
      return; // Exit if the response or entries are invalid
    }

    // Calculate the mean number of test cases per entry

    const meanTestCasesPerEntry =
      response.entries.reduce((total: number, entry: any) => {
        try {
          let parsedEntry = JSON.parse(entry.response);
          console.log("Response Entries Length", parsedEntry.length);
          // Ensure parsedEntry is treated as an array
          const entryLength = Array.isArray(parsedEntry)
            ? parsedEntry.length
            : 1;
          return total + entryLength;
        } catch (error) {
          console.error("Error parsing entry response:", error);
          return total;
        }
      }, 0) / response.entries.length;

    // Ensure the calculated page size is at least 1
    const calculatedPageSize = Math.max(1, Math.ceil(meanTestCasesPerEntry)); // Round up the mean and ensure a minimum value of 1

    // Set pagination count based on the calculated page size
    const paginationCount = Math.ceil(allTestCases.length / calculatedPageSize);
    // Set state values directly
    setPageSize(calculatedPageSize);
    setPaginationCount(paginationCount);
  };

  const columns: GridColDef[] = [
    { field: "testId", headerName: "Test ID", width: 100 },
    { field: "title", headerName: "Title", width: 300 },
    { field: "description", headerName: "Description", width: 500 },
    {
      field: "status",
      headerName: "Active Job Status",
      width: 150,
      renderCell: (params) => (
        <ExecutionStatus
          clickedTestCase={clickedTestCase}
          testCase={params.row}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={(event) => handlePlayClick(event, params.row.id)}
            color="primary"
          >
            <PlayArrowIcon />
          </IconButton>
          <IconButton
            onClick={(event) => handleViewSummaryClick(event, params.row.id)}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows: GridRowsProp = testCases.map((testCase) => ({
    id: testCase.id,
    testId: testCase.test_case_id,
    title: testCase.test_case_title,
    description: testCase.description,
    lastExecutedOn: testCase.last_executed_on, // New field for last executed date
    status: testCase.status || "no_order", // New field for status
    tc_hash: computeTcHash(testCase),
    prompt_hash: testCase.prompt_hash,
  }));

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Test Cases
      </Typography>

      {loading && (
        <div>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={200} />
          <Skeleton variant="text" width={400} />
          <Skeleton variant="text" width={600} />
          <Skeleton variant="text" width={800} />
          <Skeleton variant="text" width={1000} />
          <Skeleton variant="text" width={1200} />
        </div>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {/* {snackbarOpen && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          sx={{ top: 90, right: 90 }} // Adjust the bottom offset to move the Snackbar up
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            variant="filled"
            sx={{
              width: "100%",
              backgroundColor: variantColorMap[snackbarSeverity],
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )} */}

      {!loading && !error && (
        <Paper style={{ height: "90%", width: "100%" }}>
          <DataGrid
            sx={{ height: "80%", width: "100% " }}
            rows={rows}
            columns={columns}
            pagination
            pageSizeOptions={[testCases.length]} // Dynamically set options
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: Math.min(pageSize, testCases.length), // Set default to smallest value
                },
              },
            }}
            onRowClick={handleRowClick}
          />
        </Paper>
      )}

      <DescriptionModal
        open={open}
        onClose={handleClose}
        testCase={selectedTestCase}
      />

      <ExecutionSummaryModal
        open={summaryOpen}
        onClose={handleSummaryClose}
        fetchLogsforTestCase={fetchLogsforTestCase}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{ bottom: 90 }} // Adjust the bottom offset to move the Snackbar up
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: variantColorMap[snackbarSeverity],
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShowResponse;

function computeTcHash(testCase: TestCase): string {
  const {
    test_case_title,
    test_case_id,
    description,
    test_steps,
    expected_results,
    validations,
  } = testCase;
  const hashString = JSON.stringify({
    test_case_title,
    test_case_id,
    description,
    test_steps,
    expected_results,
    validations,
  });
  return CryptoJS.SHA256(hashString).toString(CryptoJS.enc.Hex);
}
