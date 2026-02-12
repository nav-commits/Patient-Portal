"use client";
import {
  Flex,
  Box,
  Text,
  Stack,
  Card,
  Heading,
  Separator,
} from "@chakra-ui/react";
import { patient1 } from "@/data/patient";

export default function Profile() {
  const patient = patient1;
  const latestLabResult = patient.labResults[0]; 
  const dob = new Date(patient.dob);
  // eslint-disable-next-line react-hooks/purity
  const age = Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970);
  const fields = [
    { label: "Date of Birth", value: `${patient.dob} (Age ${age})` },
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
    { label: "Medicare", value: patient.insurance.medicare },
    { label: "Medicaid", value: patient.insurance.medicaid },
  ];

  return (
    <Box px={4} py={10}>
      <Heading size="xl" mb={6}>Personal Info</Heading>
      <Flex justify="center">
        <Card.Root maxW="650px" w="100%" shadow="lg" borderRadius="xl">
          <Card.Header>
            <Heading size="md">{patient.name}</Heading>
            <Text fontSize="sm" color="gray.500">Personal Details</Text>
          </Card.Header>
          <Card.Body>
            <Stack gap={5}>
              <Separator />
              {fields.map((field, idx) => (
                <Box key={idx}>
                  <Text fontSize="sm" color="gray.500">{field.label}</Text>
                  <Text fontWeight="medium">{field.value}</Text>
                </Box>
              ))}
              <Separator />
              <Text fontSize="xs" color="gray.500">
                If any information is incorrect, please contact the doctor’s office and/or laboratory.
              </Text>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Box>
  );
}
