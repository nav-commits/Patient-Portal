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
  Badge,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FiBarChart2 } from "react-icons/fi";
import { patient1 } from "@/data/patient";
import { useMemo, useState } from "react";
import { sections } from "@/lib/section";
import { getStatus, Status, getStatusColor } from "@/lib/status";
import { DownloadPDFButton } from "@/app/components/DownloadPDFButton";
export default function Results() {
  const router = useRouter();

  const years = useMemo(() => {
    return Array.from(
      new Set(
        patient1.labResults.map((result) => new Date(result.date).getFullYear())
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

  const handleGraphClick = (test: string) => {
    router.push(`/patient/${patient1.id}/test/${encodeURIComponent(test)}`);
  };
  return (
    <Box p={4}>
      <Heading size="2xl" mb={6}>
        {patient1.name}'s Lab Results
      </Heading>
      {/* Download PDF Button */}

      {selectedResult && (
        <DownloadPDFButton patient={patient1} labResult={selectedResult} />
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
        <Text mb={2}>
          Specimen Collected:{" "}
          {format(new Date(selectedResult.date), "MMM dd, yyyy hh:mm a")}
        </Text>
      )}

      <Text mb={4}>
        Have additional questions concerning your results? Please consult your
        doctor.
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
                const numericValue =
                  typeof value === "number" ? value : Number(value);
                const status: Status =
                  range && !isNaN(numericValue)
                    ? getStatus(numericValue, range)
                    : Status.Normal;
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
                    <Table.Cell
                      fontWeight={
                        status !== Status.Normal ? "semibold" : "normal"
                      }
                    >
                      {test}
                    </Table.Cell>
                    <Table.Cell>{value ?? "—"}</Table.Cell>
                    <Table.Cell>
                      {selectedResult?.units[test] ?? "—"}
                    </Table.Cell>
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
