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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

type AuthFormValues = {
  email: string;
  password?: string;
};

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  // Separate forms for each tab
  const loginForm = useForm<AuthFormValues>({ mode: "onSubmit" });
  const registerForm = useForm<AuthFormValues>({ mode: "onSubmit" });
  const resetForm = useForm<AuthFormValues>({ mode: "onSubmit" });

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
    clearErrors: clearLoginErrors,
  } = loginForm;
  const {
    register: regRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors },
    reset: resetRegister,
    clearErrors: clearRegErrors,
  } = registerForm;
  const {
    register: resetRegisterField,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    reset: resetReset,
    clearErrors: clearResetErrors,
  } = resetForm;

  // 🔍 Verify patient exists in Firestore
  const verifyPatientEmail = async (email: string) => {
    const q = query(collection(db, "patients"), where("email", "==", email));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].id;
  };

  // 🔐 LOGIN
  const handleLogin = handleLoginSubmit(async (data) => {
    setLoading(true);
    setServerError("");
    setServerSuccess("");
    try {
      const patientId = await verifyPatientEmail(data.email);
      if (!patientId)
        throw new Error("No patient record found with this email.");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password!
      );
      const uid = userCredential.user.uid;
      const userDocRef = doc(db, "users", uid);
      const userSnap = await getDocs(
        query(collection(db, "users"), where("uid", "==", uid))
      );
      if (userSnap.empty || !userSnap.docs[0].data().name) {
        const patientSnap = await getDocs(
          query(collection(db, "patients"), where("id", "==", patientId))
        );
        const patientData = patientSnap.docs[0].data();

        await setDoc(
          userDocRef,
          {
            email: data.email,
            patientId,
            name: patientData.name || null,
          },
          { merge: true }
        );
      }
      router.push("/patient/results");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Login failed.");
      }
    } finally {
      setLoading(false);
    }
  });

  // 🟢 REGISTER
  const handleRegister = handleRegisterSubmit(async (data) => {
    setLoading(true);
    setServerError("");
    setServerSuccess("");
    try {
      const patientId = await verifyPatientEmail(data.email);
      if (!patientId)
        throw new Error(
          "You must have been seen by a participating physician."
        );

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password!
      );
      const uid = userCredential.user.uid;
      const userDocRef = doc(db, "users", uid);

      // Fetch patient info to get name
      const patientSnap = await getDocs(
        query(collection(db, "patients"), where("id", "==", patientId))
      );
      const patientData = patientSnap.docs[0].data();

      // Save email, patientId, AND name
      await setDoc(
        userDocRef,
        {
          email: data.email,
          patientId,
          name: patientData.name || null,
        },
        { merge: true }
      );

      router.push("/patient/results");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  });

  // 🔵 RESET PASSWORD
  const handleReset = handleResetSubmit(async (data) => {
    setLoading(true);
    setServerError("");
    setServerSuccess("");
    try {
      const patientId = await verifyPatientEmail(data.email);
      if (!patientId)
        throw new Error("No patient record found with this email.");
      await sendPasswordResetEmail(auth, data.email);
      setServerSuccess("Reset email sent. Please check your inbox.");
      resetReset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Reset failed.");
      }
    } finally {
      setLoading(false);
    }
  });

  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email",
    },
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} rounded="xl" shadow="lg" w="400px">
        <Tabs.Root
          defaultValue="login"
          onValueChange={() => {
            clearLoginErrors();
            clearRegErrors();
            clearResetErrors();
            resetLogin({ email: "", password: "" });
            resetRegister({ email: "", password: "" });
            resetReset({ email: "" });
            setServerError("");
            setServerSuccess("");
          }}
        >
          <Tabs.List mb={6}>
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="register">Register</Tabs.Trigger>
            <Tabs.Trigger value="reset">Reset</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          {/* LOGIN */}
          <Tabs.Content value="login">
            <form onSubmit={handleLogin}>
              <Stack gap="4">
                <Field.Root invalid={!!loginErrors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    {...loginRegister("email", emailValidation)}
                  />
                  <Field.ErrorText>
                    {loginErrors.email?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!loginErrors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input
                    type="password"
                    {...loginRegister("password", {
                      required: "Password is required",
                    })}
                  />
                  <Field.ErrorText>
                    {loginErrors.password?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Button type="submit" loading={loading} colorPalette="blue">
                  Login
                </Button>
              </Stack>
            </form>
          </Tabs.Content>

          {/* REGISTER */}
          <Tabs.Content value="register">
            <form onSubmit={handleRegister}>
              <Stack gap="4">
                <Field.Root invalid={!!regErrors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    {...regRegister("email", emailValidation)}
                  />
                  <Field.ErrorText>{regErrors.email?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!regErrors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input
                    type="password"
                    {...regRegister("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                  />
                  <Field.ErrorText>
                    {regErrors.password?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Button type="submit" loading={loading} colorPalette="blue">
                  Register
                </Button>
              </Stack>
            </form>
          </Tabs.Content>

          {/* RESET */}
          <Tabs.Content value="reset">
            <form onSubmit={handleReset}>
              <Stack gap="4">
                <Field.Root invalid={!!resetErrors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    {...resetRegisterField("email", emailValidation)}
                  />
                  <Field.ErrorText>
                    {resetErrors.email?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Button type="submit" loading={loading} colorPalette="blue">
                  Send Reset Email
                </Button>
              </Stack>
            </form>
          </Tabs.Content>
        </Tabs.Root>

        {/* SERVER MESSAGES */}
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
