"use client";

import { Flex, Text, Spacer, Avatar, Box } from "@chakra-ui/react";

export default function Header() {
  return (
    <Flex
      w="100%"
      h="60px"
      align="center"
      px={6}
      bg="blue.800" 
      borderBottom="1px solid"
      bgColor={"blue.900"}
    >
      {/* Welcome Text */}
      <Text fontSize="xl" fontWeight="bold" color="white">
        Welcome
      </Text>
      <Spacer />
      {/* User Info */}
      <Flex align="center" gap={3}>
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="semibold" color="white">
            John Doe
          </Text>
          <Text fontSize="xs" color="blue.200">
            Patient
          </Text>
        </Box>
        <Avatar.Root>
          <Avatar.Fallback name="Segun Adebayo" />
          <Avatar.Image src="https://bit.ly/sage-adebayo" />
        </Avatar.Root>
      </Flex>
    </Flex>
  );
}
