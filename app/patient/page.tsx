"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <Flex direction="column" px={4} py={10} bg="gray.50" gap={6}>
      <Heading size={'xl'} mb={2}>Welcome Navdeep Dhamrait</Heading>
      <Text fontSize="md">
        Hello! Here in your Med-Health Laboratory Patient Portal, you can
        securely access your personal information and view your lab results
        anytime. Your health data is private, secure, and available 24/7.
      </Text>
      <Text fontSize="md">
        To check your most recent blood test results, please visit the{" "}
        <ChakraLink
          as={Link}
          href="/patient/results"
          color="blue.600"
          fontWeight="semibold"
        >
          Lab Results
        </ChakraLink>
        {" "} 
        page. If you have any questions about your results, our staff is here to
        help.
      </Text>
      <Box>
        <Link href="/patient/results" passHref>
          <Button
            bg="blue.900"
            color="white"
            _hover={{
              bg: "white",
              color: "blue.900",
              border: "1px solid",
              borderColor: "blue.900",
            }}
            transition="all 0.3s ease"
          >
            View Lab Results
          </Button>
        </Link>
      </Box>
      <Text fontSize="sm" mt={2}>
        Need to update your personal information or profile settings? Click on
        the "Personal Info" tab in the sidebar to keep your records up to date.
      </Text>
    </Flex>
  );
}
