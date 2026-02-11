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

export default function Profile() {
  const patient = {
    fullName: "Navdeep Dhamrait",
    dob: "1994-03-17",
    age: 31,
    gender: "Male",
    address: "168 Edenbrookhill Dr., Brampton, ON L7A 2C1, CA",
    lastService: "February 18, 2025",
    phone: "905-495-3467",
    primaryCare: "Not Provided",
    medicare: "Not Provided",
    medicaid: "Not Provided",
    healthCard: "6428549619PR",
  };

  return (
    <Flex minH="60vh" align="center" justify="center" px={4} py={10}>
      <Card.Root maxW="650px" w="100%" shadow="lg" borderRadius="xl">
        <Card.Header>
          <Heading size="md">{patient.fullName}</Heading>
          <Text fontSize="sm" color="gray.500">
            Personal Details
          </Text>
        </Card.Header>
        <Card.Body>
          <Stack gap={5}>
            <Separator />
            <Box>
              <Text fontSize="sm" color="gray.500">Date of Birth</Text>
              <Text fontWeight="medium">
                {patient.dob} (Age {patient.age})
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Gender</Text>
              <Text fontWeight="medium">{patient.gender}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Address</Text>
              <Text fontWeight="medium">{patient.address}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Last Date of Service</Text>
              <Text fontWeight="medium">{patient.lastService}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Phone Number</Text>
              <Text fontWeight="medium">{patient.phone}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Primary Care Physician</Text>
              <Text fontWeight="medium">{patient.primaryCare}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Medicare</Text>
              <Text fontWeight="medium">{patient.medicare}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Medicaid</Text>
              <Text fontWeight="medium">{patient.medicaid}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Health Card #</Text>
              <Text fontWeight="medium">{patient.healthCard}</Text>
            </Box>
            <Separator />
            <Text fontSize="xs" color="gray.500">
              If any information is incorrect, please contact the doctor’s office and/or laboratory.
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}
