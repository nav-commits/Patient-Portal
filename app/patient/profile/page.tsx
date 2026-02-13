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
  Tag,
} from "@chakra-ui/react";
import { patient1 } from "@/data/patient";

export default function Profile() {
  const patient = patient1;
  const latestLabResult = patient.labResults[0];
  const dob = new Date(patient.dob);
  const age = Math.abs(
    new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970
  );

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
                <Avatar.Fallback name="Navdeep Dhamrait" />
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
              <SimpleGrid columns={{ base: 1, md: 2 }}>
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
