"use client";

import {
  Box,
  Table,
  Heading,
  Text,
  Icon,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FiBarChart2 } from "react-icons/fi";
import { patient1 } from "@/data/patient";
import { useMemo, useState } from "react";

export default function Results() {
  const router = useRouter();
  
  const years = useMemo(() => {
    return Array.from(
      new Set(
        patient1.labResults.map((result) =>
          new Date(result.date).getFullYear()
        )
      )
    ).sort((a, b) => b - a);
  }, []);

  const yearCollection = useMemo(
    () =>
      createListCollection({
        items: years.map((year) => ({
          label: year.toString(),
          value: year.toString(),
        })),
      }),
    [years]
  );

  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    years[0]?.toString()
  );

  const selectedResult = useMemo(() => {
    if (!selectedYear) return undefined;

    return patient1.labResults.find(
      (result) =>
        new Date(result.date).getFullYear().toString() === selectedYear
    );
  }, [selectedYear]);

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

  const handleGraphClick = (test: string) => {
    router.push(`/patient/${patient1.id}/test/${encodeURIComponent(test)}`);
  };

  return (
    <Box p={4}>
      <Heading size="2xl" mb={6}>
        {patient1.name}'s Lab Results
      </Heading>
      <Box mb={4}>
        <Select.Root
          collection={yearCollection}
          size="sm"
          width="220px"
          value={selectedYear ? [selectedYear] : []}
          onValueChange={(details) =>
            setSelectedYear(details.value[0])
          }
        >
          <Select.HiddenSelect />
          <Select.Label>Filter by Year</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select year" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {yearCollection.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Box>
      {selectedResult && (
        <Text mb={2}>
          Specimen Collected:{" "}
          {format(new Date(selectedResult.date), "MMM dd, yyyy hh:mm a")}
        </Text>
      )}
      <Text mb={4}>
        Have additional questions concerning your results? Please consult your
        doctor.
      </Text>
      {Object.entries(sections).map(([sectionName, tests]) => (
        <Box key={sectionName} mb={6}>
          <Heading size="md" mb={2}>
            {sectionName}
          </Heading>
          <Table.Root size="sm">
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
                  <Table.Cell>
                    {selectedResult?.results[test] ?? "—"}
                  </Table.Cell>
                  <Table.Cell>
                    {selectedResult?.units[test] ?? "—"}
                  </Table.Cell>
                  <Table.Cell>
                    {selectedResult?.referenceRanges[test] ?? "—"}
                  </Table.Cell>
                  <Table.Cell>
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
