"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {User } from "firebase/auth";
import {auth} from '../lib/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Spinner, Center, VStack, Text } from "@chakra-ui/react";

// -------------------- Types --------------------
export interface LabResult {
  date: string;
  orderedItems: string[];
  results: Record<string, number | string>;
  units: Record<string, string>;
  referenceRanges: Record<string, string>;
}

export interface Patient {
  uid: string;
  email: string | null;
  patientId: string;
  name: string | null;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  primaryCarePhysician: string;
  insurance: {
    medicare: string;
    medicaid: string;
  };
  labResults: LabResult[];
}

interface PatientAuthContextType {
  patient: Patient | null;
  loading: boolean;
}

const PatientAuthContext = createContext<PatientAuthContextType>({
  patient: null,
  loading: true,
});

export function usePatientAuth() {
  return useContext(PatientAuthContext);
}

async function fetchPatientData(user: User): Promise<Patient | null> {
  const token = await user.getIdToken();
  const res = await fetch("/api/patient", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch patient data");
  return data.patient as Patient;
}

// -------------------- Provider --------------------
interface PatientAuthProviderProps {
  children: ReactNode;
}

export function PatientAuthProvider({ children }: PatientAuthProviderProps) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        const patientData = await fetchPatientData(user);
        if (!patientData) {
          router.push("/login");
          return;
        }
        setPatient(patientData);
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);
  console.log(patient)
  return (
    <PatientAuthContext.Provider value={{ patient, loading }}>
      {loading ? (
        <Center minH="100vh">
          <VStack>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="md" color="gray.600">
              Loading...
            </Text>
          </VStack>
        </Center>
      ) : (
        children
      )}
    </PatientAuthContext.Provider>
  );
}