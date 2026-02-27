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
  useBreakpointValue,
  Flex,
  Card,
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

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Get unique years
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
    <Box p={{ base: 4, md: 6 }}>
      <Heading size={{ base: "lg", md: "2xl" }} mb={6}>
        {patient.name}'s Lab Results
      </Heading>

      {/* Year Filter */}
      {years.length > 0 && (
        <Box mb={6}>
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

      <VStack align="stretch">
        {selectedResults.map((result, idx) => (
          <Box
            key={idx}
            mb={8}
            p={{ base: 4, md: 6 }}
            borderWidth="1px"
            borderRadius="lg"
          >
            <DownloadPDFButton patient={patient} labResult={result} />

            <Text mb={6} fontSize="sm" color="gray.600">
              Specimen Collected:{" "}
              {format(new Date(result.date), "MMM dd, yyyy hh:mm a")}
            </Text>

            {Object.entries(sections).map(([sectionName, tests]) => (
              <Box key={sectionName} mb={8}>
                <Heading size="md" mb={4}>
                  {sectionName}
                </Heading>
                {/* MOBILE VIEW */}
                {isMobile ? (
                  <VStack align="stretch" gap={3}>
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
                        <Card.Root
                          key={test}
                          borderWidth="1px"
                          borderRadius="md"
                          borderLeft="4px solid"
                          borderLeftColor={
                            status === Status.Normal ? "green.400" : "red.400"
                          }
                        >
                          <Card.Body p={4}>
                            {/* Test Name */}
                            <Text fontWeight="bold" mb={1}>
                              {test}
                            </Text>

                            {/* Result */}
                            <Text fontSize="sm">
                              <b>Result:</b> {value ?? "—"}{" "}
                              {result?.units?.[test] ?? ""}
                            </Text>

                            {/* Reference */}
                            <Text fontSize="sm">
                              <b>Reference:</b> {range ?? "—"}
                            </Text>

                            {/* Status + Graph */}
                            <Flex
                              mt={4}
                              p={3}
                              borderWidth="1px"
                              borderRadius="lg"
                              bg="gray.50"
                              align="center"
                              justify="space-between"
                            >
                              <Badge
                                colorPalette={getStatusColor(status)}
                                variant={
                                  status === Status.Normal ? "subtle" : "solid"
                                }
                                fontSize="0.8rem"
                                px={3}
                                py={1}
                                borderRadius="full"
                              >
                                {status}
                              </Badge>

                              <Icon
                                as={FiBarChart2}
                                boxSize={6}
                                cursor="pointer"
                                color="teal.500"
                                _hover={{
                                  color: "teal.700",
                                  transform: "scale(1.1)",
                                }}
                                transition="0.2s"
                                onClick={() => handleGraphClick(test)}
                              />
                            </Flex>
                          </Card.Body>
                        </Card.Root>
                      );
                    })}
                  </VStack>
                ) : (
                  /* DESKTOP TABLE */
                  <Table.Root size="sm">
                    <Table.Header
                      position="sticky"
                      top="0"
                      bg="white"
                      zIndex="1"
                    >
                      <Table.Row>
                        <Table.ColumnHeader>Test</Table.ColumnHeader>
                        <Table.ColumnHeader>Result</Table.ColumnHeader>
                        <Table.ColumnHeader>Units</Table.ColumnHeader>
                        <Table.ColumnHeader>Reference Range</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                        <Table.ColumnHeader>Graph</Table.ColumnHeader>
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
                            <Table.Cell fontWeight="medium">{test}</Table.Cell>
                            <Table.Cell>{value ?? "—"}</Table.Cell>
                            <Table.Cell>
                              {result?.units?.[test] ?? "—"}
                            </Table.Cell>
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
                                _hover={{
                                  color: "teal.700",
                                }}
                                boxSize={6}
                                onClick={() => handleGraphClick(test)}
                              />
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </VStack>
      <Text mt={6} fontSize="sm" color="gray.600">
        Have additional questions concerning your results? Please consult your
        doctor.
      </Text>
    </Box>
  );
}
