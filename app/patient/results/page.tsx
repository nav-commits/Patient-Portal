"use client";
import { Icon } from "@chakra-ui/react";
import { Box, Table, Heading, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FiBarChart2 } from "react-icons/fi";
import { patient1 } from "@/data/patient";

export default function Results() {
  const latestResult = patient1.labResults[0];

  const sections: Record<string, string[]> = {
    HEMATOLOGY: [
      "WBC",
      "RBC",
      "Hemoglobin",
      "Hematocrit",
      "Platelet Count",
      "MCV",
      "MCH",
      "MCHC",
      "RDW",
    ],
    "DIFFERENTIAL COUNT": [
      "Neutrophil",
      "Lymphocyte",
      "Monocyte",
      "Eosinophil",
      "Basophil",
    ],
    URINALYSIS: [
      "SpecificGravity",
      "pH",
      "Sugar (Urine)",
      "Protein (Urine)",
      "Ketone",
      "Blood",
      "Leukocytes",
      "Nitrite",
    ],
    "GENERAL CHEMISTRY": [
      "Glucose Fasting",
      "HbA1C",
      "Creatinine",
      "eGFR",
      "Sodium",
      "Potassium",
      "Chloride",
      "Alk Phosphatase",
      "ALT (SGPT)",
      "Uric Acid",
      "Cholesterol",
      "Triglycerides",
      "HDL Cholesterol",
      "LDL Cholesterol",
      "Chol:HDL Ratio",
      "NON-HDL Choleste",
      "Fasting",
      "TSH Ultra-sens",
      "Vitamin B12",
      "Ferritin",
      "VitD 25Hydroxy",
      "MicroalbuminRDMU",
      "Urine Creatinine",
      "MAL/Creat Ratio2",
    ],
  };
  const router = useRouter();
  const handleGraphClick = (test: string) => {
    router.push(`/patient/${patient1.id}/test/${encodeURIComponent(test)}`);
  };
  return (
    <Box p={4}>
      <Heading size="lg" mb={2}>
        {patient1.name}'s Latest Lab Results
      </Heading>
      <Text mb={2}>
        Specimen Collected:{" "}
        {format(new Date(latestResult.date), "MMM dd, yyyy hh:mm a")}
      </Text>
      <Text mb={4}>
        Have additional questions concerning your results? Please consult your
        doctor.
      </Text>

      {Object.entries(sections).map(([sectionName, tests]) => (
        <Box key={sectionName} mb={6}>
          <Heading size="md" mb={2}>
            {sectionName}
          </Heading>
          <Table.Root  size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Test</Table.ColumnHeader>
                <Table.ColumnHeader>Result</Table.ColumnHeader>
                <Table.ColumnHeader>Units</Table.ColumnHeader>
                <Table.ColumnHeader>Reference Range</Table.ColumnHeader>
                <Table.ColumnHeader>Graph past results</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tests.map((test) => (
                <Table.Row key={test}>
                  <Table.Cell>{test}</Table.Cell>
                  <Table.Cell>{latestResult.results[test]}</Table.Cell>
                  <Table.Cell>{latestResult.units[test]}</Table.Cell>
                  <Table.Cell>{latestResult.referenceRanges[test]}</Table.Cell>
                  <Table.Cell>
                    {" "}
                    <Icon
                      as={FiBarChart2}
                      w={5}
                      h={5}
                      cursor="pointer"
                      color="teal.500"
                      _hover={{ color: "teal.700" }}
                      onClick={() => handleGraphClick(test)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      ))}
    </Box>
  );
}
