"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Field,
  Input,
  Stack,
  Tabs,
  Text,
  Center,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

type AuthFormValues = {
  email: string;
  password?: string;
  terms?: boolean;
};

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const loginForm = useForm<AuthFormValues>({ mode: "onSubmit" });
  const registerForm = useForm<AuthFormValues>({ mode: "onSubmit" });
  const resetForm = useForm<AuthFormValues>({ mode: "onSubmit" });

  const forms = { loginForm, registerForm, resetForm };

  const emailValidation = {
    required: "Email is required",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
  };

  const runAsync =
    (fn: (data: AuthFormValues) => Promise<void>) =>
    async (data: AuthFormValues) => {
      setLoading(true);
      setServerError("");
      setServerSuccess("");
      try {
        await fn(data);
      } catch (err: unknown) {
        setServerError(
          err instanceof Error ? err.message : "Operation failed."
        );
      } finally {
        setLoading(false);
      }
    };

  // 🔐 LOGIN
  const handleLogin = runAsync(async ({ email, password }) => {
    const userCred = await signInWithEmailAndPassword(auth, email!, password!);
    const token = await userCred.user.getIdToken();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    router.push("/patient/results");
  });

  // 🟢 REGISTER
  const handleRegister = runAsync(async ({ email, password, terms }) => {
    if (!terms) throw new Error("You must agree to the Terms of Service");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    router.push("/patient/results");
  });

  // 🔵 RESET PASSWORD
  const handleReset = runAsync(async ({ email }) => {
    // Check patient exists
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Send Firebase reset email
    await sendPasswordResetEmail(auth, email!);

    setServerSuccess("Reset email sent. Please check your inbox.");
    resetForm.reset();
  });

  const clearAllForms = () => {
    Object.values(forms).forEach((form) => {
      form.reset({ email: "", password: "" });
      form.clearErrors();
    });
    setServerError("");
    setServerSuccess("");
  };

  return (
    <Center minH="100vh" bg="gray.50" p={4}>
      <Box bg="white" p={8} rounded="xl" shadow="lg" w="600px">
        {/* Top Banner Image */}
        <Box mb={6} textAlign="center">
          <Image
            src="/Images/mhl-banner.png" // note the leading slash
            alt="Med-Health Laboratory Banner"
            width={600} // adjust width
            height={150} // adjust height
            style={{ borderRadius: "8px" }} // optional rounded corners
          />
        </Box>
        <Tabs.Root defaultValue="login" onValueChange={clearAllForms}>
          <Tabs.List mb={6}>
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="register">Register</Tabs.Trigger>
            <Tabs.Trigger value="reset">Reset</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          {/* LOGIN */}
          <Tabs.Content value="login">
            <Box mb={6}>
              <Heading size="md" mb={2}>
                Welcome to Med-Health Laboratory's Patient Portal
              </Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Using our secure portal you will be able to view your health
                records from the privacy of your own home or office 24 x 7.
              </Text>
              <Text fontSize="sm" color="gray.600">
                If you don't own or control the computer you're using, turn on
                "private browsing" to protect your personal health information.
              </Text>
            </Box>
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <Stack gap="4">
                <Field.Root invalid={!!loginForm.formState.errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    {...loginForm.register("email", emailValidation)}
                  />
                  <Field.ErrorText>
                    {loginForm.formState.errors.email?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!loginForm.formState.errors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input
                    type="password"
                    {...loginForm.register("password", {
                      required: "Password is required",
                    })}
                  />
                  <Field.ErrorText>
                    {loginForm.formState.errors.password?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Button
                  type="submit"
                  loading={loading}
                  _hover={{
                    bg: "white",
                    color: "blue.900",
                    border: "1px solid",
                    borderColor: "blue.900",
                  }}
                  transition="all 0.3s ease"
                  bgColor="blue.900"
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Tabs.Content>

          {/* REGISTER */}
          <Tabs.Content value="register">
            <Box mb={6}>
              <Heading size="md" mb={2}>
                Register for Med-Health Laboratory's Patient Portal
              </Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Enter the email address you provided your physician. Within a
                few minutes, you will receive an email that includes
                instructions.
              </Text>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Please Note: To be able to access your medical record within the
                Patient Portal, you must have been seen by a participating
                physician.
              </Text>
            </Box>

            <form onSubmit={registerForm.handleSubmit(handleRegister)}>
              <Stack gap="4">
                <Field.Root invalid={!!registerForm.formState.errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    {...registerForm.register("email", emailValidation)}
                  />
                  <Field.ErrorText>
                    {registerForm.formState.errors.email?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!registerForm.formState.errors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input
                    type="password"
                    {...registerForm.register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                  />
                  <Field.ErrorText>
                    {registerForm.formState.errors.password?.message}
                  </Field.ErrorText>
                </Field.Root>

                {/* Terms Checkbox */}
                <Field.Root invalid={!!registerForm.formState.errors.terms}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <input
                      type="checkbox"
                      {...registerForm.register("terms", {
                        required: "You must agree to the Terms of Service",
                      })}
                    />
                    I agree to the{" "}
                    <Link
                      href="https://results.mhlab.ca/patient/tos.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3182CE", textDecoration: "underline" }}
                    >
                      Terms Of Service and Privacy Policy
                    </Link>
                  </label>
                  <Field.ErrorText>
                    {registerForm.formState.errors.terms?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Button
                  type="submit"
                  loading={loading}
                  _hover={{
                    bg: "white",
                    color: "blue.900",
                    border: "1px solid",
                    borderColor: "blue.900",
                  }}
                  transition="all 0.3s ease"
                  bgColor="blue.900"
                >
                  Register
                </Button>
              </Stack>
            </form>
          </Tabs.Content>

          {/* RESET */}
          <Tabs.Content value="reset">
            <form onSubmit={resetForm.handleSubmit(handleReset)}>
              <Stack gap="4">
                <Field.Root invalid={!!resetForm.formState.errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    {...resetForm.register("email", emailValidation)}
                  />
                  <Field.ErrorText>
                    {resetForm.formState.errors.email?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Button
                  type="submit"
                  loading={loading}
                  _hover={{
                    bg: "white",
                    color: "blue.900",
                    border: "1px solid",
                    borderColor: "blue.900",
                  }}
                  transition="all 0.3s ease"
                  bgColor="blue.900"
                >
                  Send Reset Email
                </Button>
              </Stack>
            </form>
          </Tabs.Content>
        </Tabs.Root>

        {serverError && (
          <Text mt={4} fontSize="sm" color="red.500" textAlign="center">
            {serverError}
          </Text>
        )}

        {serverSuccess && (
          <Text mt={4} fontSize="sm" color="green.500" textAlign="center">
            {serverSuccess}
          </Text>
        )}

        <Text mt={6} fontSize="sm" color="gray.500" textAlign="center">
          Using our secure portal you can view your health records 24/7.
        </Text>
      </Box>
    </Center>
  );
}
