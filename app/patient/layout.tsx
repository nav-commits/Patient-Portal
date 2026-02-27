"use client";

import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { PatientAuthProvider } from "@/context/PatientAuthContext";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <PatientAuthProvider>
      <Flex h="100vh" overflow="hidden">
        {!isMobile && <Sidebar />}
        <Flex direction="column" flex="1" overflow="hidden">
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
          <Box
            flex="1"
            minH="0"
            p={{ base: 4, md: 6 }}
            overflowY="auto"
          >
            {children}
          </Box>
        </Flex>
        {isMobile && (
          <Sidebar
            isDrawer
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </Flex>
    </PatientAuthProvider>
  );
}