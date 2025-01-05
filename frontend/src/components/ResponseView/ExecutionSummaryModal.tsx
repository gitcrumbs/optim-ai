import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoggerComponent from "../LogFactory/LoggerComponent";

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

interface ExpectedResult {
  status_code: number;
  headers: Record<string, string>;
  body: string;
  notes?: string;
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

interface ExecutionSummaryModalProps {
  open: boolean;
  onClose: () => void;
  fetchLogsforTestCase?: ParsedTestCase | null;
}

const ExecutionSummaryModal: React.FC<ExecutionSummaryModalProps> = ({
  open,
  onClose,
  fetchLogsforTestCase,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: "translate(-50%, -50%)" }}
        width={"80%"}
        height={"80%"}
        bgcolor="background.paper"
        boxShadow={24}
        p={4}
      >
        <Typography variant="h6" component="h2">
          Active Execution Logs
        </Typography>
        <Box mt={2}>
          {fetchLogsforTestCase ? (
            <Box>
              <Typography variant="body1">
                <strong>Description:</strong> {fetchLogsforTestCase.description}
              </Typography>

              <Box sx={{ overflow: "auto" }}>
                <LoggerComponent
                  open={open}
                  onClose={onClose}
                  prompt_hash={fetchLogsforTestCase.prompt_hash}
                  tc_hash={fetchLogsforTestCase.tc_hash}
                />
              </Box>
            </Box>
          ) : (
            <Typography variant="body1">
              No execution summary available.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ExecutionSummaryModal;
