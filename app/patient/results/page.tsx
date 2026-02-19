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
  Center, Spinner, Text
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FiBarChart2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { sections } from "@/lib/section";
import { getStatus, Status, getStatusColor } from "@/lib/status";
import { DownloadPDFButton } from "@/app/components/DownloadPDFButton";
import { db } from "@/lib/firebase";
import { collection, getDocs} from "firebase/firestore";
import { Patient } from "@/types/patient.types";

export default function Results() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);

  // Fetch all patients (take the first one)
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "patients"));
        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const data = firstDoc.data() as Patient;
          data.id = firstDoc.id; 
          setPatient(data);
          const years = Array.from(
            new Set(data.labResults.map((r) => new Date(r.date).getFullYear()))
          ).sort((a, b) => b - a);
          setSelectedYear(years[0]?.toString());
        } else {
          console.error("No patients found in Firestore.");
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);


  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  
  if (!patient)
    return (
      <Center h="100vh">
        <Text fontSize="xl" color="red.500">
          Patient not found.
        </Text>
      </Center>
    );

  // Compute available years directly
  const years = Array.from(
    new Set(patient.labResults.map((r) => new Date(r.date).getFullYear()))
  ).sort((a, b) => b - a);

  const yearCollection = createListCollection({
    items: years.map((year) => ({ label: year.toString(), value: year.toString() })),
  });

  // Get selected lab result
  const selectedResult =
    selectedYear &&
    patient.labResults.find(
      (r) => new Date(r.date).getFullYear().toString() === selectedYear
    );

  const handleGraphClick = (test: string) => {
    router.push(`/patient/${patient.id}/test/${encodeURIComponent(test)}`);
  };

  return (
    <Box p={4}>
      <Heading size="2xl" mb={6}>
        {patient.name}'s Lab Results
      </Heading>

      {selectedResult && (
        <DownloadPDFButton patient={patient} labResult={selectedResult} />
      )}

      {/* Year Filter */}
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

      {selectedResult && (
        <Text mb={4}>
          Specimen Collected: {format(new Date(selectedResult.date), "MMM dd, yyyy hh:mm a")}
        </Text>
      )}

      <Text mb={4}>
        Have additional questions concerning your results? Please consult your doctor.
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
                const value = selectedResult?.results[test];
                const range = selectedResult?.referenceRanges[test];
                const numericValue = typeof value === "number" ? value : Number(value);
                const status: Status =
                  range && !isNaN(numericValue) ? getStatus(numericValue, range) : Status.Normal;
                return (
                  <Table.Row
                    key={test}
                    bg={
                      status === Status.High
                        ? "red.50"
                        : status === Status.Low
                        ? "blue.50"
                        : status === Status.Borderline
                        ? "yellow.50"
                        : "transparent"
                    }
                  >
                    <Table.Cell fontWeight={status !== Status.Normal ? "semibold" : "normal"}>
                      {test}
                    </Table.Cell>
                    <Table.Cell>{value ?? "—"}</Table.Cell>
                    <Table.Cell>{selectedResult?.units[test] ?? "—"}</Table.Cell>
                    <Table.Cell>{range ?? "—"}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={getStatusColor(status)}
                        variant={status === Status.Normal ? "subtle" : "solid"}
                      >
                        {status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Icon
                        as={FiBarChart2}
                        w={7}
                        h={10}
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
  );
}
