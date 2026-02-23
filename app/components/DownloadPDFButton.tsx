
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button, Box } from "@chakra-ui/react";
import { LabReportPDF } from "./LabReport";
import { Patient, LabResult } from "@/types/patient.types";
interface Props {
  patient: Patient;
  labResult: LabResult;
}

export const DownloadPDFButton: React.FC<Props> = ({ patient, labResult }) => {
  return (
    <Box mb={4}>
      <PDFDownloadLink
        document={<LabReportPDF patient={patient} labResult={labResult} />}
        fileName={`${patient.name}-LabResults.pdf`}
      >
        {() => <Button>Download Report</Button>}
      </PDFDownloadLink>
    </Box>
  );
};
