import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ORDERED_ITEMS, UNITS, REFERENCE_RANGES } from "../../../../data/patient";

export async function POST(req: Request) {
  try {
    const patientRef = doc(db, "patients", "patient1");
    const patientSnap = await getDoc(patientRef);

    if (!patientSnap.exists()) {
      return new Response(
        JSON.stringify({ error: "Patient1 does not exist yet" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const patientData = patientSnap.data();

    // Lab result for 2025 (new different month)
    const newLabResult2025 = {
      date: "2025-08-15T09:00:00",
      orderedItems: ORDERED_ITEMS,
      results: {
        WBC: 5.5, RBC: 4.8, Hemoglobin: 145, Hematocrit: 0.423, "Platelet Count": 230,
        MCV: 87.8, MCH: 30.2, MCHC: 340, RDW: 13.1,
        Neutrophil: 2.7, Lymphocyte: 2.0, Monocyte: 0.4, Eosinophil: 0.1, Basophil: 0.0,
        SpecificGravity: 1.015, pH: 6.8, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
        Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
        "Glucose Fasting": 4.8, HbA1C: 5.2, Creatinine: 89, eGFR: 102,
        Sodium: 136, Potassium: 4.5, Chloride: 101, "Alk Phosphatase": 58, "ALT (SGPT)": 17,
        "Uric Acid": 178, Cholesterol: 3.95, Triglycerides: 0.45, "HDL Cholesterol": 2.05, "LDL Cholesterol": 1.65,
        "Chol:HDL Ratio": 1.92, "NON-HDL Choleste": 1.9, Fasting: ">10 Hours", "TSH Ultra-sens": 1.7,
        "Vitamin B12": 300, Ferritin: 90, "VitD 25Hydroxy": 100, MicroalbuminRDMU: "<7.0",
        "Urine Creatinine": 6.0, "MAL/Creat Ratio1": "**", "MAL/Creat Ratio2": "**",
        "Anti-HBs": 18, "Anti-HCV": "NEGATIVE", "Anti-HAV": "NEGATIVE", "CPK-Total": 195
      },
      units: UNITS,
      referenceRanges: REFERENCE_RANGES
    };

    // Add new lab result to existing labResults
    const updatedLabResults = [...(patientData.labResults || []), newLabResult2025];

    await setDoc(patientRef, {
      ...patientData,
      labResults: updatedLabResults
    });

    return new Response(
      JSON.stringify({ 
        message: "2025 lab result added successfully", 
        labResult: newLabResult2025
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to add lab result" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}