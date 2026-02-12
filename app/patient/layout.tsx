"use client";

import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex h="100vh" overflow="hidden">
  <Sidebar />
  <Flex direction="column" flex="1" overflow="hidden">
    <Header />
    <Box flex="1" minH="0" p={6} overflowY="auto">
      {children}
    </Box>
  </Flex>
</Flex>

  );
}
