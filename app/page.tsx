"use client";

import { Box, Heading, Text, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Box p={10} minH="100vh">
      <Heading mb={4}>Welcome to the Portal</Heading>
      <Text mb={4}>
        If this box has padding, a gray background, and styled text, your
        provider is set up correctly.
      </Text>
      <Button
        asChild
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
        <Link href="/dashboard">View Results</Link>
      </Button>
    </Box>
  );
}
