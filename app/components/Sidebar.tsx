"use client";

import { VStack, Flex, Icon, Text, Box } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHome } from "react-icons/io5";
import { HiDocumentReport, HiUser } from "react-icons/hi";
import Image from "next/image";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: IoHome },
  { label: "Lab Results", href: "/dashboard/results", icon: HiDocumentReport },
  { label: "Personal Info", href: "/dashboard/profile", icon: HiUser },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <VStack
      width="250px"
      bgColor="blue.900"
      borderRight="1px solid"
      borderColor="gray.800"
      p={4}
      align="stretch"
    >
      <Box w="full" textAlign="center" mb={10} mt={3}>
        <Image
          src="/Images/mhl-logo-white.png"
          alt="Med-Health Lab Logo"
          width={210}      
          height={90}     
          style={{ objectFit: "contain" }}
        />
      </Box>
      <VStack align="stretch">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.label} href={link.href} passHref>
              <Flex
                align="center"
                gap={3}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                bg={isActive ? "white" : "transparent"}
                _hover={{ bg: isActive ? "white" : "blue.800" }}
                transition="all 0.2s"
              >
                <Icon
                  as={link.icon}
                  w={5}
                  h={5}
                  color={isActive ? "blue.900" : "white"}
                />
                <Text
                  fontWeight="semibold"
                  color={isActive ? "blue.900" : "white"}
                >
                  {link.label}
                </Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </VStack>
  );
}
