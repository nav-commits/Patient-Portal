"use client";

import { Flex, Text, Spacer, Avatar, Box, Menu } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";

export default function Header() {
  return (
    <Flex
      w="100%"
      h="90px"
      align="center"
      px={10}
      bg="blue.900"
      justify="space-between"
      borderBottom="1px solid"
      borderColor="blue.800"
    >
      <Text fontSize="2xl" fontWeight="bold" color="white">
        Med-Health-Laboratory
      </Text>

      <Flex align="center" gap={3}>
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="semibold" color="white">
            Navdeep Dhamrait
          </Text>
          <Text fontSize="xs" color="blue.200">
            Patient
          </Text>
        </Box>
        <Avatar.Root size="sm">
          <Avatar.Fallback name="Navdeep Dhamrait" />
        </Avatar.Root>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Box cursor="pointer" color="white">
              <FaChevronDown size={16} />
            </Box>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="profile">Go to Profile</Menu.Item>
              <Menu.Item value="signout">Sign Out</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Flex>
    </Flex>
  );
}
