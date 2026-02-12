
interface LabResult {
    date: string;
    orderedItems: string[];
    results: Record<string, number | string>;
    units: Record<string, string>;
    referenceRanges: Record<string, string>;
    pdfUrl: string;
  }
  
  export interface Patient {
    id: string;
    name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    primaryCarePhysician: string;
    insurance: {
      medicare: string;
      medicaid: string;
    };
    labResults: LabResult[];
  }
  

  export const patient1: Patient = {
    id: "patient1",
    name: "Navdeep Dhamrait",
    dob: "1994-03-17",
    gender: "Male",
    email: "navdeep.dhamrait94@gmail.com",
    phone: "123-456-7890",
    address: "Brampton, Ontario, Canada",
    primaryCarePhysician: "Dr. Malhotra",
    insurance: { medicare: "123456789", medicaid: "987654321" },
    labResults: [
      {
        date: "2025-02-18T10:25:00",
        orderedItems: [
          "WBC","RBC","Hemoglobin","Hematocrit","Platelet Count","MCV","MCH","MCHC","RDW",
          "Neutrophil","Lymphocyte","Monocyte","Eosinophil","Basophil",
          "SpecificGravity","pH","Sugar (Urine)","Protein (Urine)","Ketone","Blood","Leukocytes","Nitrite",
          "Glucose Fasting","HbA1C","Creatinine","eGFR","Sodium","Potassium","Chloride","Alk Phosphatase","ALT (SGPT)",
          "Uric Acid","Cholesterol","Triglycerides","HDL Cholesterol","LDL Cholesterol","Chol:HDL Ratio","NON-HDL Choleste",
          "Fasting","TSH Ultra-sens","Vitamin B12","Ferritin","VitD 25Hydroxy","MicroalbuminRDMU","Urine Creatinine","MAL/Creat Ratio2"
        ],
        results: {
          WBC: 5.2, RBC: 4.78, Hemoglobin: 145, Hematocrit: 0.422, "Platelet Count": 234,
          MCV: 88.2, MCH: 30.4, MCHC: 344, RDW: 13.3,
          Neutrophil: 2.5, Lymphocyte: 2.2, Monocyte: 0.4, Eosinophil: 0.1, Basophil: 0.0,
          SpecificGravity: 1.01, pH: 7.0, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
          Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
          "Glucose Fasting": 4.7, HbA1C: 5.2, Creatinine: 88, eGFR: 104,
          Sodium: 136, Potassium: 4.7, Chloride: 101, "Alk Phosphatase": 61, "ALT (SGPT)": 15,
          "Uric Acid": 174, Cholesterol: 3.87, Triglycerides: 0.44, "HDL Cholesterol": 2.08, "LDL Cholesterol": 1.59,
          "Chol:HDL Ratio": 1.9, "NON-HDL Choleste": 1.79, Fasting: ">10 Hours", "TSH Ultra-sens": 1.55,
          "Vitamin B12": 320, Ferritin: 101, "VitD 25Hydroxy": 103, MicroalbuminRDMU: "<7.0",
          "Urine Creatinine": 6.15, "MAL/Creat Ratio2": "**"
        },
        units: {
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
          "Urine Creatinine": "mmol/L", "MAL/Creat Ratio2": "N/A"
        },
        referenceRanges: {
          WBC: "4.0-11.0", RBC: "4.7-6.0", Hemoglobin: "140-180", Hematocrit: "0.40-0.54", "Platelet Count": "150-400",
          MCV: "80-98", MCH: "27.5-32.5", MCHC: "320-360", RDW: "11.5-14.5",
          Neutrophil: "2.0-7.5", Lymphocyte: "1.0-3.5", Monocyte: "0.0-0.8", Eosinophil: "0.0-0.5", Basophil: "0.0-0.2",
          SpecificGravity: "1.010-1.030", pH: "5.5-8.0", "Sugar (Urine)": "-", "Protein (Urine)": "-", Ketone: "-", Blood: "-", Leukocytes: "-", Nitrite: "-",
          "Glucose Fasting": "3.6-6.0", HbA1C: "<6.0", Creatinine: "53-113", eGFR: ">=90",
          Sodium: "136-145", Potassium: "3.5-5.1", Chloride: "101-111", "Alk Phosphatase": "30-130", "ALT (SGPT)": "7-52",
          "Uric Acid": "262-452", Cholesterol: "<5.20", Triglycerides: "<1.70", "HDL Cholesterol": "0.59-2.38", "LDL Cholesterol": "<3.36",
          "Chol:HDL Ratio": "-", "NON-HDL Choleste": "-", Fasting: "-", "TSH Ultra-sens": "0.35-4.94",
          "Vitamin B12": "133-675", Ferritin: "30-300", "VitD 25Hydroxy": "76-175", MicroalbuminRDMU: "-", "Urine Creatinine": "-", "MAL/Creat Ratio2": "-"
        },
        pdfUrl: "https://example.com/demo-navdeep-feb2025.pdf",
      },
      {
        date: "2024-12-31T09:00:00", // updated 2024 result
        orderedItems: [
          "WBC","RBC","Hemoglobin","Hematocrit","Platelet Count","MCV","MCH","MCHC","RDW",
          "Neutrophil","Lymphocyte","Monocyte","Eosinophil","Basophil",
          "SpecificGravity","pH","Sugar (Urine)","Protein (Urine)","Ketone","Blood","Leukocytes","Nitrite",
          "Glucose Fasting","HbA1C","Creatinine","eGFR","Sodium","Potassium","Chloride","Alk Phosphatase","ALT (SGPT)",
          "Uric Acid","Cholesterol","Triglycerides","HDL Cholesterol","LDL Cholesterol","Chol:HDL Ratio","NON-HDL Choleste",
          "Fasting","TSH Ultra-sens","Vitamin B12","Ferritin","MicroalbuminRDMU","Urine Creatinine","MAL/Creat Ratio2"
        ],
        results: {
          WBC: 5.3, RBC: 4.77, Hemoglobin: 140, Hematocrit: 0.421, "Platelet Count": 211,
          MCV: 88.3, MCH: 29.4, MCHC: 333, RDW: 13.3,
          Neutrophil: 2.8, Lymphocyte: 1.9, Monocyte: 0.4, Eosinophil: 0.1, Basophil: 0.0,
          SpecificGravity: 1.019, pH: 6.0, "Sugar (Urine)": "Negative", "Protein (Urine)": "Negative",
          Ketone: "Negative", Blood: "Negative", Leukocytes: "Negative", Nitrite: "Negative",
          "Glucose Fasting": 4.5, HbA1C: 5.3, Creatinine: 90, eGFR: 98,
          Sodium: 138, Potassium: 4.8, Chloride: 104, "Alk Phosphatase": 59, "ALT (SGPT)": 21,
          "Uric Acid": 180, Cholesterol: 3.99, Triglycerides: 0.43, "HDL Cholesterol": 2.05, "LDL Cholesterol": 1.74,
          "Chol:HDL Ratio": 1.9, "NON-HDL Choleste": 1.93, Fasting: ">10 Hours", "TSH Ultra-sens": 2.50,
          "Vitamin B12": 244, Ferritin: 63, MicroalbuminRDMU: "<7.0", "Urine Creatinine": 8.21, "MAL/Creat Ratio2": "**"
        },
        units: {
          WBC: "10**9/L", RBC: "10**12/L", Hemoglobin: "g/L", Hematocrit: "L/L", "Platelet Count": "10**9/L",
          MCV: "fL", MCH: "pg", MCHC: "g/L", RDW: "%",
          Neutrophil: "10**9/L", Lymphocyte: "10**9/L", Monocyte: "10**9/L", Eosinophil: "10**9/L", Basophil: "10**9/L",
          SpecificGravity: "N/A", pH: "pH", "Sugar (Urine)": "N/A", "Protein (Urine)": "N/A",
          Ketone: "N/A", Blood: "N/A", Leukocytes: "N/A", Nitrite: "N/A",
          "Glucose Fasting": "mmol/L", HbA1C: "%", Creatinine: "umol/L", eGFR: "N/A",
          Sodium: "mmol/L", Potassium: "mmol/L", Chloride: "mmol/L", "Alk Phosphatase": "U/L", "ALT (SGPT)": "U/L",
          "Uric Acid": "umol/L", Cholesterol: "mmol/L", Triglycerides: "mmol/L", "HDL Cholesterol": "mmol/L", "LDL Cholesterol": "mmol/L",
          "Chol:HDL Ratio": "N/A", "NON-HDL Choleste": "mmol/L", Fasting: "N/A", "TSH Ultra-sens": "mIU/L",
          "Vitamin B12": "pmol/L", Ferritin: "ug/L", MicroalbuminRDMU: "mg/L", "Urine Creatinine": "mmol/L", "MAL/Creat Ratio2": "N/A"
        },
        referenceRanges: {
          WBC: "4.0-11.0", RBC: "4.7-6.0", Hemoglobin: "140-180", Hematocrit: "0.40-0.54", "Platelet Count": "150-400",
          MCV: "80-98", MCH: "27.5-32.5", MCHC: "320-360", RDW: "11.5-14.5",
          Neutrophil: "2.0-7.5", Lymphocyte: "1.0-3.5", Monocyte: "0.0-0.8", Eosinophil: "0.0-0.5", Basophil: "0.0-0.2",
          SpecificGravity: "1.010-1.030", pH: "5.5-8.0", "Sugar (Urine)": "-", "Protein (Urine)": "-", Ketone: "-", Blood: "-", Leukocytes: "-", Nitrite: "-",
          "Glucose Fasting": "3.6-6.0", HbA1C: "<6.0", Creatinine: "53-113", eGFR: ">=90",
          Sodium: "136-145", Potassium: "3.5-5.1", Chloride: "101-111", "Alk Phosphatase": "30-130", "ALT (SGPT)": "7-52",
          "Uric Acid": "262-452", Cholesterol: "<5.20", Triglycerides: "<1.70", "HDL Cholesterol": "0.59-2.38", "LDL Cholesterol": "<3.36",
          "Chol:HDL Ratio": "-", "NON-HDL Choleste": "-", Fasting: "-", "TSH Ultra-sens": "0.35-4.94",
          "Vitamin B12": "133-675", Ferritin: "30-300", MicroalbuminRDMU: "-", "Urine Creatinine": "-", "MAL/Creat Ratio2": "-"
        },
        pdfUrl: "https://example.com/demo-navdeep-2024.pdf",
      }
    ],
  };
  