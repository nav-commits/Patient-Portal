
import { db } from "@/lib/firebase"; // your Firebase initialized app
import { collection, doc, setDoc } from "firebase/firestore";

const ORDERED_ITEMS = [
  "WBC","RBC","Hemoglobin","Hematocrit","Platelet Count","MCV","MCH","MCHC","RDW",
  "Neutrophil","Lymphocyte","Monocyte","Eosinophil","Basophil",
  "SpecificGravity","pH","Sugar (Urine)","Protein (Urine)","Ketone","Blood","Leukocytes","Nitrite",
  "Glucose Fasting","HbA1C","Creatinine","eGFR","Sodium","Potassium","Chloride","Alk Phosphatase","ALT (SGPT)",
  "Uric Acid","Cholesterol","Triglycerides","HDL Cholesterol","LDL Cholesterol","Chol:HDL Ratio","NON-HDL Choleste",
  "Fasting","TSH Ultra-sens","Vitamin B12","Ferritin","VitD 25Hydroxy","MicroalbuminRDMU","Urine Creatinine",
  "MAL/Creat Ratio1","MAL/Creat Ratio2","Anti-HBs","Anti-HCV","Anti-HAV","CPK-Total"
].filter(Boolean);

const UNITS: Record<string, string> = {
  WBC: "10**9/L", RBC: "10**12/L", Hemoglobin: "g/L", Hematocrit: "L/L", "Platelet Count": "10**9/L",
  MCV: "fL", MCH: "pg", MCHC: "g/L", RDW: "%",
  Neutrophil: "10**9/L", Lymphocyte: "10**9/L", Monocyte: "10**9/L", Eosinophil: "10**9/L", Basophil: "10**9/L",
  SpecificGravity: "N/A", pH: "pH", "Sugar (Urine)": "N/A", "Protein (Urine)": "N/A",
  Ketone: "N/A", Blood: "N/A", Leukocytes: "N/A", Nitrite: "N/A",
  "Glucose Fasting": "mmol/L", HbA1C: "%", Creatinine: "umol/L", eGFR: "N/A",
  Sodium: "mmol/L", Potassium: "mmol/L", Chloride: "mmol/L", "Alk Phosphatase": "U/L", "ALT (SGPT)": "U/L",
  "Uric Acid": "umol/L", Cholesterol: "mmol/L", Triglycerides: "mmol/L", "HDL Cholesterol": "mmol/L", "LDL Cholesterol": "mmol/L",
  "Chol:HDL Ratio": "N/A", "NON-HDL Choleste": "mmol/L", Fasting: "N/A", "TSH Ultra-sens": "mIU/L",
  "Vitamin B12": "pmol/L", Ferritin: "ug/L", "VitD 25Hydroxy": "nmol/L", MicroalbuminRDMU: "mg/L",
  "Urine Creatinine": "mmol/L", "MAL/Creat Ratio1": "N/A", "MAL/Creat Ratio2": "N/A",
  "Anti-HBs": "mIU/mL", "Anti-HCV": "N/A", "Anti-HAV": "N/A", "CPK-Total": "U/L"
};

const REFERENCE_RANGES: Record<string, string> = {
  WBC: "4.0-11.0", RBC: "4.7-6.0", Hemoglobin: "140-180", Hematocrit: "0.40-0.54", "Platelet Count": "150-400",
  MCV: "80-98", MCH: "27.5-32.5", MCHC: "320-360", RDW: "11.5-14.5",
  Neutrophil: "2.0-7.5", Lymphocyte: "1.0-3.5", Monocyte: "0.0-0.8", Eosinophil: "0.0-0.5", Basophil: "0.0-0.2",
  SpecificGravity: "1.010-1.030", pH: "5.5-8.0", "Sugar (Urine)": "-", "Protein (Urine)": "-", Ketone: "-", Blood: "-", Leukocytes: "-", Nitrite: "-",
  "Glucose Fasting": "3.6-6.0", HbA1C: "<6.0", Creatinine: "53-113", eGFR: ">=90",
  Sodium: "136-145", Potassium: "3.5-5.1", Chloride: "101-111", "Alk Phosphatase": "30-130", "ALT (SGPT)": "7-52",
  "Uric Acid": "262-452", Cholesterol: "<5.20", Triglycerides: "<1.70", "HDL Cholesterol": "0.59-2.38", "LDL Cholesterol": "<3.36",
  "Chol:HDL Ratio": "-", "NON-HDL Choleste": "-", Fasting: "-", "TSH Ultra-sens": "0.35-4.94",
  "Vitamin B12": "133-675", Ferritin: "30-300", "VitD 25Hydroxy": "76-175", MicroalbuminRDMU: "-", "Urine Creatinine": "-", 
  "MAL/Creat Ratio1": "-", "MAL/Creat Ratio2": "-", "Anti-HBs": "-", "Anti-HCV": "-", "Anti-HAV": "-", "CPK-Total": "1-238"
};

export async function POST(req: Request) {

  try {
    const patient2 = {
      id: "patient2",
      name: "Simran Kaur",
      dob: "1992-07-12",
      gender: "Female",
      email: "simran.kaur92@gmail.com",
      phone: "987-654-3210",
      address: "Toronto, Ontario, Canada",
      primaryCarePhysician: "Dr. Sharma",
      insurance: { medicare: "987654321", medicaid: "123456789" },
      labResults: [
        // 2025
        {
          date: "2025-11-10T09:00:00",
          orderedItems: ORDERED_ITEMS,
          results: { WBC: 5.4, RBC: 4.80, Hemoglobin: 144, Hematocrit: 0.425, "Platelet Count": 220, MCV: 87.5, MCH: 30.1, MCHC: 340, RDW: 13.1,
            Neutrophil: 2.6, Lymphocyte: 2.1, Monocyte: 0.5, Eosinophil: 0.1, Basophil: 0.0,
            SpecificGravity: 1.02, pH: 6.5, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
            Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
            "Glucose Fasting": 4.8, HbA1C: 5.3, Creatinine: 89, eGFR: 102,
            Sodium: 137, Potassium: 4.6, Chloride: 103, "Alk Phosphatase": 60, "ALT (SGPT)": 18,
            "Uric Acid": 178, Cholesterol: 4.00, Triglycerides: 0.45, "HDL Cholesterol": 2.10, "LDL Cholesterol": 1.70,
            "Chol:HDL Ratio": 1.9, "NON-HDL Choleste": 1.90, Fasting: ">10 Hours", "TSH Ultra-sens": 1.60,
            "Vitamin B12": 310, Ferritin: 95, "VitD 25Hydroxy": 105, MicroalbuminRDMU: "<7.0",
            "Urine Creatinine": 6.20, "MAL/Creat Ratio2": "**"
          },
          units: UNITS,
          referenceRanges: REFERENCE_RANGES
        },
        {
          date: "2025-03-05T09:00:00",
          orderedItems: ORDERED_ITEMS,
          results: { WBC: 5.6, RBC: 4.78, Hemoglobin: 142, Hematocrit: 0.420, "Platelet Count": 215, MCV: 87.8, MCH: 29.8, MCHC: 338, RDW: 13.0,
            Neutrophil: 2.7, Lymphocyte: 2.0, Monocyte: 0.4, Eosinophil: 0.1, Basophil: 0.0,
            SpecificGravity: 1.015, pH: 6.8, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
            Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
            "Glucose Fasting": 4.7, HbA1C: 5.2, Creatinine: 91, eGFR: 100,
            Sodium: 136, Potassium: 4.7, Chloride: 102, "Alk Phosphatase": 59, "ALT (SGPT)": 19,
            "Uric Acid": 175, Cholesterol: 3.95, Triglycerides: 0.42, "HDL Cholesterol": 2.05, "LDL Cholesterol": 1.66,
            "Chol:HDL Ratio": 1.9, "NON-HDL Choleste": 1.90, Fasting: ">10 Hours", "TSH Ultra-sens": 1.70,
            "Vitamin B12": 315, Ferritin: 100, "VitD 25Hydroxy": 102, MicroalbuminRDMU: "<7.0",
            "Urine Creatinine": 6.10, "MAL/Creat Ratio2": "**"
          },
          units: UNITS,
          referenceRanges: REFERENCE_RANGES
        },
        // 2024
        {
          date: "2024-06-15T09:00:00",
          orderedItems: ORDERED_ITEMS,
          results: { WBC: 5.5, RBC: 4.75, Hemoglobin: 141, Hematocrit: 0.418, "Platelet Count": 210, MCV: 87.9, MCH: 30.0, MCHC: 339, RDW: 13.2,
            Neutrophil: 2.8, Lymphocyte: 2.0, Monocyte: 0.5, Eosinophil: 0.1, Basophil: 0.0,
            SpecificGravity: 1.018, pH: 6.2, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
            Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
            "Glucose Fasting": 4.6, HbA1C: 5.2, Creatinine: 90, eGFR: 99,
            Sodium: 136, Potassium: 4.5, Chloride: 101, "Alk Phosphatase": 57, "ALT (SGPT)": 18,
            "Uric Acid": 176, Cholesterol: 4.10, Triglycerides: 0.43, "HDL Cholesterol": 2.00, "LDL Cholesterol": 1.70,
            "Chol:HDL Ratio": 2.0, "NON-HDL Choleste": 2.10, Fasting: ">10 Hours", "TSH Ultra-sens": 1.65,
            "Vitamin B12": 312, Ferritin: 98, "VitD 25Hydroxy": 100, MicroalbuminRDMU: "<7.0",
            "Urine Creatinine": 6.05, "MAL/Creat Ratio2": "**"
          },
          units: UNITS,
          referenceRanges: REFERENCE_RANGES
        },
        // 2023
        {
          date: "2023-07-20T09:00:00",
          orderedItems: ORDERED_ITEMS,
          results: { WBC: 5.3, RBC: 4.72, Hemoglobin: 140, Hematocrit: 0.415, "Platelet Count": 205, MCV: 87.5, MCH: 29.5, MCHC: 337, RDW: 13.0,
            Neutrophil: 2.5, Lymphocyte: 2.0, Monocyte: 0.5, Eosinophil: 0.1, Basophil: 0.0,
            SpecificGravity: 1.015, pH: 6.8, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
            Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
            "Glucose Fasting": 4.5, HbA1C: 5.1, Creatinine: 92, eGFR: 101,
            Sodium: 136, Potassium: 4.6, Chloride: 101, "Alk Phosphatase": 55, "ALT (SGPT)": 17,
            "Uric Acid": 174, Cholesterol: 4.05, Triglycerides: 0.40, "HDL Cholesterol": 2.05, "LDL Cholesterol": 1.68,
            "Chol:HDL Ratio": 2.0, "NON-HDL Choleste": 2.15, Fasting: ">10 Hours", "TSH Ultra-sens": 1.70,
            "Vitamin B12": 308, Ferritin: 97, "VitD 25Hydroxy": 98, MicroalbuminRDMU: "<7.0",
            "Urine Creatinine": 6.00, "MAL/Creat Ratio2": "**"
          },
          units: UNITS,
          referenceRanges: REFERENCE_RANGES
        },
        // 2022
        {
          date: "2022-04-10T09:00:00",
          orderedItems: ORDERED_ITEMS,
          results: { WBC: 5.2, RBC: 4.70, Hemoglobin: 139, Hematocrit: 0.414, "Platelet Count": 200, MCV: 87.2, MCH: 29.2, MCHC: 335, RDW: 13.0,
            Neutrophil: 2.4, Lymphocyte: 2.0, Monocyte: 0.4, Eosinophil: 0.1, Basophil: 0.0,
            SpecificGravity: 1.012, pH: 6.5, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
            Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
            "Glucose Fasting": 4.4, HbA1C: 5.0, Creatinine: 91, eGFR: 102,
            Sodium: 135, Potassium: 4.5, Chloride: 101, "Alk Phosphatase": 55, "ALT (SGPT)": 16,
            "Uric Acid": 172, Cholesterol: 3.95, Triglycerides: 0.39, "HDL Cholesterol": 2.00, "LDL Cholesterol": 1.65,
            "Chol:HDL Ratio": 2.0, "NON-HDL Choleste": 2.10, Fasting: ">10 Hours", "TSH Ultra-sens": 1.60,
            "Vitamin B12": 305, Ferritin: 96, "VitD 25Hydroxy": 95, MicroalbuminRDMU: "<7.0",
            "Urine Creatinine": 5.95, "MAL/Creat Ratio2": "**"
          },
          units: UNITS,
          referenceRanges: REFERENCE_RANGES
        },
        // 2021
        {
          date: "2021-02-15T09:00:00",
          orderedItems: ORDERED_ITEMS,
          results: { WBC: 5.0, RBC: 4.68, Hemoglobin: 138, Hematocrit: 0.412, "Platelet Count": 198, MCV: 87.0, MCH: 29.0, MCHC: 333, RDW: 12.8,
            Neutrophil: 2.3, Lymphocyte: 2.0, Monocyte: 0.4, Eosinophil: 0.1, Basophil: 0.0,
            SpecificGravity: 1.010, pH: 6.3, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
            Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
            "Glucose Fasting": 4.3, HbA1C: 5.1, Creatinine: 90, eGFR: 103,
            Sodium: 135, Potassium: 4.4, Chloride: 100, "Alk Phosphatase": 54, "ALT (SGPT)": 16,
            "Uric Acid": 170, Cholesterol: 3.90, Triglycerides: 0.38, "HDL Cholesterol": 1.98, "LDL Cholesterol": 1.63,
            "Chol:HDL Ratio": 2.0, "NON-HDL Choleste": 2.10, Fasting: ">10 Hours", "TSH Ultra-sens": 1.58,
            "Vitamin B12": 300, Ferritin: 95, "VitD 25Hydroxy": 92, MicroalbuminRDMU: "<7.0",
            "Urine Creatinine": 5.90, "MAL/Creat Ratio2": "**"
          },
          units: UNITS,
          referenceRanges: REFERENCE_RANGES
        },
        // 2020
        {
          date: "2020-03-20T09:00:00",
          orderedItems: ORDERED_ITEMS,
          results: { WBC: 4.9, RBC: 4.65, Hemoglobin: 137, Hematocrit: 0.410, "Platelet Count": 195, MCV: 86.8, MCH: 28.8, MCHC: 332, RDW: 12.7,
            Neutrophil: 2.2, Lymphocyte: 1.9, Monocyte: 0.4, Eosinophil: 0.1, Basophil: 0.0,
            SpecificGravity: 1.008, pH: 6.2, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
            Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
            "Glucose Fasting": 4.2, HbA1C: 5.0, Creatinine: 89, eGFR: 104,
            Sodium: 135, Potassium: 4.3, Chloride: 100, "Alk Phosphatase": 53, "ALT (SGPT)": 15,
            "Uric Acid": 168, Cholesterol: 3.85, Triglycerides: 0.36, "HDL Cholesterol": 1.95, "LDL Cholesterol": 1.60,
            "Chol:HDL Ratio": 2.0, "NON-HDL Choleste": 2.05, Fasting: ">10 Hours", "TSH Ultra-sens": 1.55,
            "Vitamin B12": 298, Ferritin: 94, "VitD 25Hydroxy": 90, MicroalbuminRDMU: "<7.0",
            "Urine Creatinine": 5.85, "MAL/Creat Ratio2": "**"
          },
          units: UNITS,
          referenceRanges: REFERENCE_RANGES
        }
      ]
    };

    const patientRef = doc(collection(db, "patients"), patient2.id);
    await setDoc(patientRef, patient2);
    return new Response(JSON.stringify({ message: "Patient 2 added successfully", patient: patient2 }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to add patient" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
