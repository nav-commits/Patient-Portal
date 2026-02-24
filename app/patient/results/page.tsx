"use client";

import {
  Box,
  Table,
  Heading,
  Icon,
  Select,
  Portal,
  createListCollection,
  Badge,
  Center,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useState } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { sections } from "@/lib/section";
import { getStatus, Status, getStatusColor } from "@/lib/status";
import { DownloadPDFButton } from "@/app/components/DownloadPDFButton";
import { usePatientAuth } from "@/context/PatientAuthContext";

export default function Results() {
  const router = useRouter();
  const { patient, loading } = usePatientAuth();
  const labResults = patient?.labResults ?? [];

  // Get all unique years from labResults
  const years = Array.from(
    new Set(labResults.map((r) => new Date(r.date).getFullYear()))
  ).sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState<string>(
    years[0]?.toString() || ""
  );

  const yearCollection = createListCollection({
    items: years.map((year) => ({
      label: year.toString(),
      value: year.toString(),
    })),
  });

  // Filter all results for the selected year
  const selectedResults = selectedYear
    ? labResults
        .filter(
          (r) => new Date(r.date).getFullYear().toString() === selectedYear
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const handleGraphClick = (test: string) => {
    router.push(
      `/patient/${patient?.patientId}/test/${encodeURIComponent(test)}`
    );
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!patient) {
    return (
      <Center h="100vh">
        <Text fontSize="xl" color="red.500">
          Patient not found.
        </Text>
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading size="2xl" mb={6}>
        {patient.patientName}'s Lab Results
      </Heading>

      {/* Year Filter */}
      {years.length > 0 && (
        <Box mb={4}>
          <Select.Root
            collection={yearCollection}
            size="sm"
            width="220px"
            value={selectedYear ? [selectedYear] : []}
            onValueChange={(details) => setSelectedYear(details.value[0])}
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
      )}

      {selectedResults.length === 0 && (
        <Text>No lab results found for {selectedYear}.</Text>
      )}

      {/* Render each lab result for the selected year */}
      <VStack align="stretch">
        {selectedResults.map((result, idx) => (
          <Box key={idx} mb={6} p={4} borderWidth="1px" borderRadius="md">
            {/* PDF Download Button */}
            <DownloadPDFButton
              patient={{
                id: patient.patientId,
                name: patient.patientName || "",
                dob: patient.dob,
                gender: patient.gender,
                email: patient.email || "",
                phone: patient.phone,
                address: patient.address,
                primaryCarePhysician: patient.primaryCarePhysician,
                insurance: patient.insurance,
                labResults: patient.labResults,
              }}
              labResult={result}
            />

            <Text mb={4}>
              Specimen Collected:{" "}
              {format(new Date(result.date), "MMM dd, yyyy hh:mm a")}
            </Text>

            {/* Results Table */}
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
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Graph past results</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {tests.map((test) => {
                      const value = result?.results?.[test];
                      const range = result?.referenceRanges?.[test];
                      const numericValue =
                        typeof value === "number" ? value : Number(value);
                      const status: Status =
                        range && !isNaN(numericValue)
                          ? getStatus(numericValue, range)
                          : Status.Normal;

                      return (
                        <Table.Row key={test}>
                          <Table.Cell>{test}</Table.Cell>
                          <Table.Cell>{value ?? "—"}</Table.Cell>
                          <Table.Cell>{result?.units?.[test] ?? "—"}</Table.Cell>
                          <Table.Cell>{range ?? "—"}</Table.Cell>
                          <Table.Cell>
                            <Badge
                              colorPalette={getStatusColor(status)}
                              variant={
                                status === Status.Normal ? "subtle" : "solid"
                              }
                            >
                              {status}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>
                            <Icon
                              as={FiBarChart2}
                              cursor="pointer"
                              color="teal.500"
                              _hover={{ color: "teal.700" }}
                              onClick={() => handleGraphClick(test)}
                            />
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table.Root>
              </Box>
            ))}
          </Box>
        ))}
      </VStack>

      <Text mt={4}>
        Have additional questions concerning your results? Please consult your
        doctor.
      </Text>
    </Box>
  );
}