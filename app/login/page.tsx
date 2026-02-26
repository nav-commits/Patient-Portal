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
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

type AuthFormValues = { email: string; password?: string };

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  // 🔹 Forms
  const loginForm = useForm<AuthFormValues>({ mode: "onSubmit" });
  const registerForm = useForm<AuthFormValues>({ mode: "onSubmit" });
  const resetForm = useForm<AuthFormValues>({ mode: "onSubmit" });

  const forms = { loginForm, registerForm, resetForm };

  // 🔹 Validation
  const emailValidation = {
    required: "Email is required",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
  };

  // 🔹 Verify patient email exists
  const verifyPatientEmail = async (email: string) => {
    const q = query(collection(db, "patients"), where("email", "==", email));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].id;
  };

  // 🔹 Central async wrapper
  const runAsync = (fn: (data: AuthFormValues) => Promise<void>) => async (data: AuthFormValues) => {
    setLoading(true);
    setServerError("");
    setServerSuccess("");
    try {
      await fn(data);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 LOGIN
  const handleLogin = runAsync(async ({ email, password }) => {
    const patientId = await verifyPatientEmail(email!);
    if (!patientId) throw new Error("No patient record found with this email.");

    const userCred = await signInWithEmailAndPassword(auth, email!, password!);
    const uid = userCred.user.uid;
    const userDocRef = doc(db, "users", uid);

    const userSnap = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
    if (userSnap.empty || !userSnap.docs[0].data().name) {
      const patientSnap = await getDocs(query(collection(db, "patients"), where("id", "==", patientId)));
      const patientData = patientSnap.docs[0].data();
      await setDoc(userDocRef, { email, patientId, name: patientData.name || null }, { merge: true });
    }

    router.push("/patient/results");
  });

  // 🟢 REGISTER
  const handleRegister = runAsync(async ({ email, password }) => {
    const patientId = await verifyPatientEmail(email!);
    if (!patientId) throw new Error("You must have been seen by a participating physician.");

    const userCred = await createUserWithEmailAndPassword(auth, email!, password!);
    const uid = userCred.user.uid;
    const userDocRef = doc(db, "users", uid);

    const patientSnap = await getDocs(query(collection(db, "patients"), where("id", "==", patientId)));
    const patientData = patientSnap.docs[0].data();
    await setDoc(userDocRef, { email, patientId, name: patientData.name || null }, { merge: true });

    router.push("/patient/results");
  });

  // 🔵 RESET PASSWORD
  const handleReset = runAsync(async ({ email }) => {
    const patientId = await verifyPatientEmail(email!);
    if (!patientId) throw new Error("No patient record found with this email.");

    await sendPasswordResetEmail(auth, email!);
    setServerSuccess("Reset email sent. Please check your inbox.");
    resetForm.reset();
  });

  // 🔹 Clear all forms and errors on tab change
  const clearAllForms = () => {
    Object.values(forms).forEach((form) => {
      form.reset({ email: "", password: "" });
      Object.values(form.formState.errors).forEach((_, i) => form.clearErrors());
    });
    setServerError("");
    setServerSuccess("");
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} rounded="xl" shadow="lg" w="400px">
        <Tabs.Root defaultValue="login" onValueChange={clearAllForms}>
          <Tabs.List mb={6}>
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="register">Register</Tabs.Trigger>
            <Tabs.Trigger value="reset">Reset</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          {/* LOGIN */}
          <Tabs.Content value="login">
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <Stack gap="4">
                <Field.Root invalid={!!loginForm.formState.errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input type="email" {...loginForm.register("email", emailValidation)} />
                  <Field.ErrorText>{loginForm.formState.errors.email?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!loginForm.formState.errors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input type="password" {...loginForm.register("password", { required: "Password is required" })} />
                  <Field.ErrorText>{loginForm.formState.errors.password?.message}</Field.ErrorText>
                </Field.Root>

                <Button type="submit" loading={loading} colorPalette="blue">Login</Button>
              </Stack>
            </form>
          </Tabs.Content>

          {/* REGISTER */}
          <Tabs.Content value="register">
            <form onSubmit={registerForm.handleSubmit(handleRegister)}>
              <Stack gap="4">
                <Field.Root invalid={!!registerForm.formState.errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input type="email" {...registerForm.register("email", emailValidation)} />
                  <Field.ErrorText>{registerForm.formState.errors.email?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!registerForm.formState.errors.password}>
                  <Field.Label>Password</Field.Label>
                  <Input type="password" {...registerForm.register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} />
                  <Field.ErrorText>{registerForm.formState.errors.password?.message}</Field.ErrorText>
                </Field.Root>

                <Button type="submit" loading={loading} colorPalette="blue">Register</Button>
              </Stack>
            </form>
          </Tabs.Content>

          {/* RESET */}
          <Tabs.Content value="reset">
            <form onSubmit={resetForm.handleSubmit(handleReset)}>
              <Stack gap="4">
                <Field.Root invalid={!!resetForm.formState.errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input type="email" {...resetForm.register("email", emailValidation)} />
                  <Field.ErrorText>{resetForm.formState.errors.email?.message}</Field.ErrorText>
                </Field.Root>

                <Button type="submit" loading={loading} colorPalette="blue">Send Reset Email</Button>
              </Stack>
            </form>
          </Tabs.Content>
        </Tabs.Root>

        {/* SERVER MESSAGES */}
        {serverError && <Text mt={4} fontSize="sm" color="red.500" textAlign="center">{serverError}</Text>}
        {serverSuccess && <Text mt={4} fontSize="sm" color="green.500" textAlign="center">{serverSuccess}</Text>}

        <Text mt={6} fontSize="sm" color="gray.500" textAlign="center">
          Using our secure portal you can view your health records 24/7.
        </Text>
      </Box>
    </Center>
  );
}