"use client";

import { useParams } from "next/navigation";
import { patient1, Patient } from "@/data/patient";
import { Box, Heading, Text, VStack, Table, HStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { Chart, useChart } from "@chakra-ui/charts";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { testDescriptions } from "@/lib/testDescription";
import { AiOutlineInfoCircle } from "react-icons/ai"; 

export default function TestPage() {
  const params = useParams();
  const patientId = params.patientId;
  const testName = params.testName ? decodeURIComponent(params.testName) : null;

  if (!patientId || !testName) return <Box>Missing parameters</Box>;

  const patient: Patient | null = patient1.id === patientId ? patient1 : null;
  if (!patient) return <Box>Patient not found</Box>;

  const testResults = patient.labResults
    .filter((lr) => testName in lr.results)
    .map((lr) => ({
      date: format(new Date(lr.date), "MMMM d, yyyy h:mm a"),
      result: lr.results[testName],
      unit: lr.units[testName] || "—",
      referenceRange: lr.referenceRanges[testName] || "—",
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = testResults.map((r) => ({
    value: Number(r.result),
    date: format(new Date(r.date), "MMM yyyy"),
  }));

  const chart = useChart({
    data: chartData,
    series: [{ name: "value", color: "blue.solid" }],
  });

  return (
    <Box mt={10} px={4} maxW="5xl" mx="auto">
      <VStack align="start">
        <Heading size="xl">
          {patient.name} – {testName} History
        </Heading>
        {testDescriptions[testName] && (
          <HStack
            bg="blue.50"
            p={3}
            rounded="md"
            borderLeft="4px solid"
            borderColor="blue.400"
            w="full"
            align="start"
          >
            <AiOutlineInfoCircle color="#3182ce" size={20} style={{ marginTop: 2 }} />
            <Text fontSize="md" color="gray.700" lineHeight="tall">
              {testDescriptions[testName]}
            </Text>
          </HStack>
        )}
      </VStack>

      {/* Table */}
      {testResults.length === 0 ? (
        <Box mt={6}>No results found for this test.</Box>
      ) : (
        <>
          <Box mt={6}>
            <Table.Root size="md">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Result</Table.ColumnHeader>
                  <Table.ColumnHeader>Units</Table.ColumnHeader>
                  <Table.ColumnHeader>Reference Range</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {testResults.map((r, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>{r.date}</Table.Cell>
                    <Table.Cell>{r.result}</Table.Cell>
                    <Table.Cell>{r.unit}</Table.Cell>
                    <Table.Cell>{r.referenceRange}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          {/* Chart */}
          <Box mt={8} borderWidth={1} borderRadius="lg" p={4}>
            <Heading size="md" mb={4}>
              Historical Trend
            </Heading>
            <Chart.Root mt={12} maxH="md" chart={chart}>
              <LineChart data={chart.data}>
                <CartesianGrid stroke={chart.color("border")} vertical={false} />
                <XAxis
                  dataKey={chart.key("date")}
                  axisLine={false}
                  tickLine={false}
                  stroke={chart.color("border")}
                  label={{ value: "Time", position: "bottom" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  stroke={chart.color("border")}
                  label={{ value: "Results", position: "left", angle: -90 }}
                />
                <Tooltip animationDuration={100} cursor={false} content={<Chart.Tooltip />} />
                {chart.series.map((item) => (
                  <Line
                    key={item.name}
                    isAnimationActive={false}
                    dataKey={chart.key(item.name)}
                    stroke={chart.color(item.color)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </Chart.Root>
          </Box>
        </>
      )}
    </Box>
  );
}
