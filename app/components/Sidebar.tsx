"use client";

import { useState } from "react";
import { VStack, Flex, Icon, Text, Box } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { HiDocumentReport, HiUser, HiViewGrid } from "react-icons/hi";
import Image from "next/image";

const links = [
  { label: "Home", href: "/patient", icon: HiViewGrid },
  { label: "Lab Results", href: "/patient/results", icon: HiDocumentReport },
  { label: "Personal Info", href: "/patient/profile", icon: HiUser },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <VStack
      width={isCollapsed ? "80px" : "250px"}
      bgColor="blue.900"
      borderRight="1px solid"
      borderColor="gray.800"
      p={4}
      align="stretch"
      transition="width 0.2s"
      minH="100vh"
    >
      <Flex
        w="full"
        align="center"
        justify={isCollapsed ? "center" : "space-between"}
        gap={4}
        mt={2}
      >
        {!isCollapsed && (
          <Box>
            <Image
              src="/Images/mhl-logo-white.png"
              alt="Med-Health Lab Logo"
              width={200}
              height={70}
              style={{ objectFit: "contain" }}
            />
          </Box>
        )}
        <Icon
          as={isCollapsed ? IoArrowForward : IoArrowBack}
          w={6}
          h={6}
          color="white"
          cursor="pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </Flex>
      <VStack align="stretch" flex="1" mt="100px">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.label} href={link.href} passHref>
              <Flex
                align="center"
                gap={isCollapsed ? 0 : 3}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                bg={isActive ? "white" : "transparent"}
                _hover={{ bg: isActive ? "white" : "blue.800" }}
                transition="all 0.2s"
                justify={isCollapsed ? "center" : "flex-start"}
              >
                <Icon
                  as={link.icon}
                  w={5}
                  h={5}
                  color={isActive ? "blue.900" : "white"}
                />
                {!isCollapsed && (
                  <Text
                    fontWeight="semibold"
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
}
