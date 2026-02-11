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
      <Button asChild>
        <Link href="/dashboard">View Results</Link>
      </Button>
    </Box>
  );
}
