"use client";

import {
  Flex,
  Text,
  Avatar,
  Box,
  Menu,
  IconButton,
} from "@chakra-ui/react";
import { FaChevronDown, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePatientAuth } from "../../context/PatientAuthContext";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  const router = useRouter();
  const { patient } = usePatientAuth();

  const handleMenuClick = async (value: string) => {
    switch (value) {
      case "profile":
        router.push("/patient/profile");
        break;

      case "results":
        router.push("/patient/results");
        break;

      case "signout":
        try {
          await signOut(auth);
          router.push("/login");
        } catch (err) {
          console.error("Sign out failed:", err);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Flex
      w="100%"
      h={{ base: "70px", md: "90px" }}
      px={{ base: 4, md: 10 }}
      bg="blue.900"
      borderBottom="1px solid"
      borderColor="blue.800"
      align="center"
      justify="space-between"
    >
      {/* LEFT SIDE */}
      <Flex align="center" gap={3}>
        {onOpenSidebar && (
          <IconButton   aria-label="Open menu"
          
          display={{ base: "flex", md: "none" }}
          variant="ghost"
          color="white"
          _hover={{ bg: "blue.800" }}
          onClick={onOpenSidebar}>
      <FaBars />
  </IconButton>
        )}
      

        <Text
          fontSize={{ base: "sm", md: "2xl" }}
          fontWeight="bold"
          color="white"
          whiteSpace="nowrap"
        >
          Med Health Laboratory
        </Text>
      </Flex>

      {/* RIGHT SIDE */}
      <Flex align="center" gap={3}>
        <Box
          textAlign="right"
          display={{ base: "none", sm: "block" }}
        >
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
            <Box
              cursor="pointer"
              color="white"
              display="flex"
              alignItems="center"
            >
              <FaChevronDown size={14} />
            </Box>
          </Menu.Trigger>

          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value="profile"
                onSelect={() => handleMenuClick("profile")}
              >
                Go to Profile
              </Menu.Item>

              <Menu.Item
                value="results"
                onSelect={() => handleMenuClick("results")}
              >
                View Results
              </Menu.Item>

              <Menu.Item
                value="signout"
                onSelect={() => handleMenuClick("signout")}
              >
                Sign Out
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Flex>
    </Flex>
  );
}