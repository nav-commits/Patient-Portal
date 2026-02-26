"use client";

import { Flex, Text, Avatar, Box, Menu } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePatientAuth } from "../../context/PatientAuthContext"; 

export default function Header() {
  const router = useRouter();
  const { patient } = usePatientAuth(); 
  const handleMenuClick = async (value: string) => {
    if (value === "signout") {
      try {
        await signOut(auth);
        router.push("/login");
      } catch (err) {
        console.error("Sign out failed:", err);
      }
    } else if (value === "profile") {
      router.push("/patient/profile");
    }
  };

  return (
    <Flex
      w="100%"
      h="90px"
      px={10}
      bg="blue.900"
      borderBottom="1px solid"
      borderColor="blue.800"
      align="center"
      justify="space-between"
    >
      <Text fontSize={{ base: "sm", md: "2xl" }} fontWeight="bold" color="white">
        Med Health Laboratory
      </Text>

      <Flex align="center" gap={3}>
        <Box textAlign="right">
          <Text fontSize="xs" color="blue.200">
            Patient
          </Text>
          <Text fontSize="sm" fontWeight="semibold" color="white">
            {patient?.name || "Unknown"} 
          </Text>
        </Box>

        <Avatar.Root size="sm">
          <Avatar.Fallback name={patient?.name || "Unknown"} />
        </Avatar.Root>

        <Menu.Root>
          <Menu.Trigger asChild>
            <Box cursor="pointer" color="white">
              <FaChevronDown size={16} />
            </Box>
          </Menu.Trigger>

          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="profile" onSelect={() => handleMenuClick("profile")}>
                Go to Profile
              </Menu.Item>
              <Menu.Item value="signout" onSelect={() => handleMenuClick("signout")}>
                Sign Out
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Flex>
    </Flex>
  );
}