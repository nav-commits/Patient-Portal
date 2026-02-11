"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <Box>
      <Flex gap={1} flexDirection={"column"}>
        <Heading mb={4}>Welcome to the dashboard</Heading>
        <Text>We have all your test results here</Text>
      </Flex>
    </Box>
  );
}
