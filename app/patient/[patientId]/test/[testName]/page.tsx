"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Table,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { testDescriptions } from "@/lib/testDescription";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Patient } from "@/types/patient.types";

export default function TestPage() {
  const params = useParams();
  const patientId = params.patientId as string | undefined;
  const testName = params.testName
    ? decodeURIComponent(params.testName as string)
    : undefined;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchPatient = async () => {
      try {
        const ref = doc(db, "patients", patientId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPatient(snap.data() as Patient);
        } else {
          setPatient(null);
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);


  const labResults = patient?.labResults ?? [];

  const testResults =
    testName && patient
      ? labResults
          .filter((lr) => testName in lr.results)
          .map((lr) => ({
            rawDate: lr.date,
            date: format(new Date(lr.date), "MMMM d, yyyy h:mm a"),
            result: lr.results[testName],
            unit: lr.units[testName] || "—",
            referenceRange: lr.referenceRanges[testName] || "—",
          }))
          .sort(
            (a, b) =>
              new Date(a.rawDate).getTime() -
              new Date(b.rawDate).getTime()
          )
      : [];

  const chartData = testResults.map((r) => ({
    value: Number(r.result),
    date: format(new Date(r.rawDate), "MMM yyyy"),
  }));

  const chart = useChart({
    data: chartData,
    series: [{ name: "value", color: "blue.solid" }],
  });


  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );

  if (!patientId || !testName)
    return (
      <Center h="100vh">
        <Text>Missing parameters</Text>
      </Center>
    );

  if (!patient)
    return (
      <Center h="100vh">
        <Text color="red.500">Patient not found</Text>
      </Center>
    );


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
            <AiOutlineInfoCircle size={20} color="#3182ce" />
            <Text fontSize="md" color="gray.700" lineHeight="tall">
              {testDescriptions[testName]}
            </Text>
          </HStack>
        )}
      </VStack>

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
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  stroke={chart.color("border")}
                />
                <Tooltip
                  animationDuration={100}
                  cursor={false}
                  content={<Chart.Tooltip />}
                />
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
