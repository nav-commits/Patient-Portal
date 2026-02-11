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
    <Flex minH="100vh">
      <Sidebar />
      <Flex direction="column" flex="1">
        <Header />
        <Box flex="1" p={6} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
