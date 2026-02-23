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
  VStack,
} from "@chakra-ui/react";
import { usePatientAuth } from "@/context/PatientAuthContext";

export default function Profile() {
  const { patient, loading } = usePatientAuth();

  if (loading)
    return (
      <Center h="100vh">
        <VStack>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="md" color="gray.600">
            Loading your personal info...
          </Text>
        </VStack>
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

  const latestLabResult = patient.labResults?.[0];

  const fields = [
    { label: "Date of Birth", value: patient.dob },
    { label: "Gender", value: patient.gender },
    { label: "Address", value: patient.address },
    { label: "Email", value: patient.email ?? "N/A" },
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
        <Card.Root maxW="700px" w="100%" shadow="lg" borderRadius="xl" bg="white">
          <Card.Header py={6}>
            <Flex align="center" gap={4}>
              <Avatar.Root>
                <Avatar.Fallback name={patient.patientName ?? "Patient"} />
              </Avatar.Root>
              <Box>
                <Heading size="md">{patient.patientName ?? "Patient"}</Heading>
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
                If any information is incorrect, please contact the doctor’s office and/or laboratory.
              </Text>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Box>
  );
}