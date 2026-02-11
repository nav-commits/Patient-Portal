import { VStack, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { IoHome } from "react-icons/io5";
import { HiDocumentReport, HiUser } from "react-icons/hi";
import Image from "next/image";
const links = [
  { label: "Dashboard", href: "/dashboard", icon: IoHome },
  { label: "Lab Results", href: "/dashboard/results", icon: HiDocumentReport },
  { label: "Personal Info", href: "/dashboard/profile", icon: HiUser },
];

export default function Sidebar() {
  return (
    <VStack
      width="250px"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      p={4}
      bgColor={"blue.900"}
      align="stretch"
    >
      <Image
        src="/Images/mhl-logo-white.png"
        alt="Profile Picture"
        width={250}
        height={350}
      />
      <VStack align="stretch" mt={8}>
        {links.map((link) => (
          <Flex
            key={link.label}
            gap={3}
            align="center"
            px={2}
            py={2}
            _hover={{ cursor: "pointer" }}
            borderRadius="md"
          >
            <Icon as={link.icon} w={5} h={5} color={"white"} />
            <Text fontWeight="semibold" color={"white"}>
              <Link href={link.href}>{link.label}</Link>
            </Text>
          </Flex>
        ))}
      </VStack>
    </VStack>
  );
}
