"use client";

import {
  Flex,
  Box,
  Text,
  Stack,
  Card,
  Heading,
  Separator,
  Avatar,
  Badge,
  SimpleGrid,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Patient } from "@/types/patient.types";

export default function Profile() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const snapshot = await getDocs(collection(db, "patients"));

        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data() as Patient;
          data.id = docSnap.id;
          setPatient(data);
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  // Loading State
  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );

  // Not Found State
  if (!patient)
    return (
      <Center h="100vh">
        <Text fontSize="xl" color="red.500">
          Patient not found.
        </Text>
      </Center>
    );

  const latestLabResult = patient.labResults?.[0];

  const fields = [
    { label: "Date of Birth", value: patient.dob },
    { label: "Gender", value: patient.gender },
    { label: "Address", value: patient.address },
    { label: "Email", value: patient.email },
    { label: "Phone Number", value: patient.phone },
    { label: "Primary Care Physician", value: patient.primaryCarePhysician },
    {
      label: "Last Date of Service",
      value: latestLabResult
        ? new Date(latestLabResult.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A",
    },
    { label: "Medicare", value: patient.insurance?.medicare ?? "N/A" },
    { label: "Medicaid", value: patient.insurance?.medicaid ?? "N/A" },
  ];

  return (
    <Box px={{ base: 4, md: 8 }} py={10} minH="100vh">
      <Heading size="2xl" mb={8} textAlign="center">
        Personal Info
      </Heading>

      <Flex justify="center">
        <Card.Root
          maxW="700px"
          w="100%"
          shadow="lg"
          borderRadius="xl"
          bg="white"
        >
          <Card.Header py={6}>
            <Flex align="center" gap={4}>
              <Avatar.Root>
                <Avatar.Fallback name={patient.name} />
              </Avatar.Root>
              <Box>
                <Heading size="md">{patient.name}</Heading>
                <Badge colorScheme="teal" mt={1}>
                  Personal Details
                </Badge>
              </Box>
            </Flex>
          </Card.Header>

          <Card.Body py={6}>
            <Stack>
              <Separator />

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {fields.map((field, idx) => (
                  <Box
                    key={idx}
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    _hover={{ bg: "gray.100", shadow: "sm" }}
                  >
                    <Text fontSize="sm" color="gray.500">
                      {field.label}
                    </Text>
                    <Text fontWeight="medium">{field.value}</Text>
                  </Box>
                ))}
              </SimpleGrid>

              <Separator />

              <Text fontSize="xs" color="gray.500" textAlign="center">
                If any information is incorrect, please contact the doctor’s
                office and/or laboratory.
              </Text>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Box>
  );
}
