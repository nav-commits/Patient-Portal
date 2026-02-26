"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  patientName: string | null;
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

// -------------------- Fetch Patient --------------------
async function fetchPatientData(user: User): Promise<Patient | null> {
  const userDocRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDocRef);
  const userData = userSnap.data();

  if (!userData?.patientId) return null;

  const patientDocRef = doc(db, "patients", userData.patientId);
  const patientSnap = await getDoc(patientDocRef);
  if (!patientSnap.exists()) return null;

  const patientData = patientSnap.data();
  const patient: Patient = {
    uid: user.uid,
    email: user.email,
    patientId: userData.patientId,
    patientName: patientData.name || userData.name || null,
    dob: patientData.dob || "",
    gender: patientData.gender || "",
    phone: patientData.phone || "",
    address: patientData.address || "",
    primaryCarePhysician: patientData.primaryCarePhysician || "",
    insurance: {
      medicare: patientData.insurance?.medicare || "",
      medicaid: patientData.insurance?.medicaid || "",
    },
    labResults: patientData.labResults || [],
  };

  // Only update user name if missing
  if (!userData.name && patient.patientName) {
    await setDoc(userDocRef, { name: patient.patientName }, { merge: true });
  }

  return patient;
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