"use client";

import {
  VStack,
  Flex,
  Icon,
  Text,
  Drawer,
  Portal,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { HiDocumentReport, HiUser, HiViewGrid } from "react-icons/hi";
import Image from "next/image";
import { useState } from "react";

const links = [
  { label: "Home", href: "/patient", icon: HiViewGrid },
  { label: "Lab Results", href: "/patient/results", icon: HiDocumentReport },
  { label: "Personal Info", href: "/patient/profile", icon: HiUser },
];

interface SidebarProps {
  isDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isDrawer, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const SidebarContent = (
    <VStack
      width={isCollapsed ? "80px" : "250px"}
      transition="width 0.2s ease"
      bg="blue.900"
      p={4}
      align="stretch"
      minH="100vh"
    >
      {/* TOP SECTION */}
      <Flex
        align="center"
        justify={isCollapsed ? "center" : "space-between"}
        mb={10}
      >
        {/* Hide logo when collapsed */}
        {!isCollapsed && (
          <Box>
            <Image
              src="/Images/mhl-logo-white.png"
              alt="Logo"
              width={150}
              height={50}
              style={{ objectFit: "contain" }}
            />
          </Box>
        )}
        {!isDrawer && (
          <Icon
            as={isCollapsed ? IoArrowForward : IoArrowBack}
            w={5}
            h={5}
            color="white"
            cursor="pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        )}
      </Flex>

      {/* NAVIGATION */}
      <VStack align="stretch" gap={2}>
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link key={link.label} href={link.href}>
              <Flex
                align="center"
                justify={isCollapsed ? "center" : "flex-start"}
                gap={isCollapsed ? 0 : 3}
                px={3}
                py={3}
                borderRadius="md"
                cursor="pointer"
                transition="all 0.2s"
                bg={isActive ? "white" : "transparent"}
                _hover={{
                  bg: isActive ? "white" : "blue.800",
                }}
              >
                <Icon
                  as={link.icon}
                  w={5}
                  h={5}
                  color={isActive ? "blue.900" : "white"}
                />
                {!isCollapsed && (
                  <Text
                    fontWeight="medium"
                    color={isActive ? "blue.900" : "white"}
                  >
                    {link.label}
                  </Text>
                )}
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </VStack>
  );

  if (isDrawer) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={onClose}>
        <Portal>
          <Drawer.Positioner
            inset={0}
            bg="blackAlpha.600"
            display="flex"
            justifyContent="flex-start"
          >
            <Drawer.Content
              maxW={isCollapsed ? "80px" : "250px"}
              w="full"
              h="100vh"
              p={0}
              bg="blue.900"
            >
              {SidebarContent}
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    );
  }

  return SidebarContent;
}
