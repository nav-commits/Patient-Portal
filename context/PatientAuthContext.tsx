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
import { LabResult } from "@/types/patient.types"; 

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

interface PatientAuthProviderProps {
  children: ReactNode;
}

export function PatientAuthProvider({ children }: PatientAuthProviderProps) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists() || !userSnap.data()?.patientId) {
          router.push("/login");
          return;
        }

        const patientId = userSnap.data().patientId;

        // Fetch full patient info from "patients" collection
        const patientDocRef = doc(db, "patients", patientId);
        const patientDocSnap = await getDoc(patientDocRef);

        if (!patientDocSnap.exists()) {
          router.push("/login");
          return;
        }

        const patientDataFromDB = patientDocSnap.data();

        const patientData: Patient = {
          uid: user.uid,
          email: user.email,
          patientId,
          patientName: patientDataFromDB.name || userSnap.data().name || null,
          dob: patientDataFromDB.dob || "",
          gender: patientDataFromDB.gender || "",
          phone: patientDataFromDB.phone || "",
          address: patientDataFromDB.address || "",
          primaryCarePhysician: patientDataFromDB.primaryCarePhysician || "",
          insurance: {
            medicare: patientDataFromDB.insurance?.medicare || "",
            medicaid: patientDataFromDB.insurance?.medicaid || "",
          },
          labResults: patientDataFromDB.labResults || [],
        };

        // Update user doc with patientName if missing
        if (!userSnap.data().name && patientData.patientName) {
          await setDoc(userDocRef, { name: patientData.patientName }, { merge: true });
        }

        setPatient(patientData);
      } catch (err) {
        console.error("Error fetching patient data", err);
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