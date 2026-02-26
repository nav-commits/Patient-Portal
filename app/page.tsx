"use client";

import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FaShieldAlt,
  FaClock,
  FaFileMedical,
  FaUserMd,
  FaHospital,
} from "react-icons/fa";

export default function Home() {
  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      {/* Hero Section */}
      <Box textAlign="center" py={20} px={6}>
        <Heading size="2xl" mb={6}>
          Welcome to the Med-Health Portal
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto" mb={8}>
          Securely access your personal health information and lab results
          anytime. Your privacy and security are our top priority.
        </Text>
        <Link href="/login" passHref>
          <Button
            size="lg"
            bg="blue.900"
            color="white"
            _hover={{
              bg: "white",
              color: "blue.900",
              border: "1px solid",
              borderColor: "blue.900",
            }}
            transition="all 0.3s ease"
          >
            View Lab Results
          </Button>
        </Link>
      </Box>

      {/* Features Section */}
      <Box maxW="6xl" mx="auto" px={6} py={16}>
        <Heading size="lg" textAlign="center" mb={10}>
          Why Use Our Portal
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
          {[
            {
              icon: FaShieldAlt,
              title: "Privacy & Security",
              description:
                "All your health data is encrypted and fully protected.",
            },
            {
              icon: FaClock,
              title: "24/7 Access",
              description: "Check your results anytime, from anywhere.",
            },
            {
              icon: FaFileMedical,
              title: "Track Your Health",
              description: "Keep your lab history in one secure place.",
            },
          ].map((feature) => (
            <Box
              key={feature.title}
              bg="white"
              p={8}
              rounded="xl"
              shadow="md"
              textAlign="center"
              transition="transform 0.3s"
              _hover={{ transform: "translateY(-5px)" }}
            >
              <Icon as={feature.icon} w={12} h={12} color="blue.900" mb={4} />
              <Heading size="md" mb={2}>
                {feature.title}
              </Heading>
              <Text color="gray.600">{feature.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* How it Works Section */}
      <Box maxW="6xl" mx="auto" px={6} py={16}>
        <Heading size="lg" textAlign="center" mb={10}>
          How It Works
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
          {[
            {
              icon: FaUserMd,
              step: "Step 1",
              title: "Register",
              description:
                "Use your verified patient email to create an account.",
            },
            {
              icon: FaHospital,
              step: "Step 2",
              title: "Access Data",
              description:
                "View your personal records, lab results, and history online.",
            },
            {
              icon: FaFileMedical,
              step: "Step 3",
              title: "Track Progress",
              description:
                "Monitor your health and share results with your care team.",
            },
          ].map((item) => (
            <Box
              key={item.title}
              bg="white"
              p={8}
              rounded="xl"
              shadow="sm"
              textAlign="center"
              transition="transform 0.3s"
              _hover={{ transform: "translateY(-5px)" }}
            >
              <Icon as={item.icon} w={10} h={10} color="blue.900" mb={4} />
              <Text fontWeight="bold" color="blue.900" mb={2}>
                {item.step}
              </Text>
              <Heading size="md" mb={2}>
                {item.title}
              </Heading>
              <Text color="gray.600">{item.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Testimonials Section */}
      <Box bg="blue.50" py={20} px={6}>
        <Heading size="lg" textAlign="center" mb={12}>
          Trusted by Patients & Providers
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} maxW="5xl" mx="auto">
          <Box bg="white" p={8} rounded="xl" shadow="sm">
            <Text fontSize="md" color="gray.700" mb={4}>
              “I love having instant access to all my lab results in one secure
              place. It’s convenient and gives me peace of mind.”
            </Text>
            <Text fontWeight="bold">— Jane D., Patient</Text>
          </Box>
          <Box bg="white" p={8} rounded="xl" shadow="sm">
            <Text fontSize="md" color="gray.700" mb={4}>
              “The Med-Health Portal helps our clinic provide better patient care
              with easy access to health data.”
            </Text>
            <Text fontWeight="bold">— Dr. Smith, Physician</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Footer */}
      <Box bg="gray.900" color="white" py={6} mt="auto">
        <Text textAlign="center" fontSize="sm">
          © {new Date().getFullYear()} Med-Health Portal. All rights reserved.
        </Text>
      </Box>
    </Flex>
  );
}