"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Patient, LabResult } from "@/data/patient";
import { sections } from "../../lib/section";

interface LabReportPDFProps {
  patient: Patient;
  labResult: LabResult;
}

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  header: { fontSize: 16, textAlign: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 14, marginVertical: 8, fontWeight: "bold" },
  table: {
    width: "auto",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableColHeader: {
    width: "25%",
    fontWeight: "bold",
    padding: 4,
  },
  tableCol: {
    width: "25%",
    padding: 4,
  },
});

export const LabReportPDF: React.FC<LabReportPDFProps> = ({
  patient,
  labResult,
}) => {

  const collectionDate = new Date(labResult.date);
  const printedDate = new Date();
  printedDate.setFullYear(collectionDate.getFullYear());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===== MED-HEALTH HEADER BLOCK ===== */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 11 }}>
            Performed By: MED-HEALTH LABORATORIES LTD.
          </Text>
          <Text style={{ fontSize: 11 }}>
            www.mhlab.ca | support@mhlab.ca
          </Text>
          <Text style={{ fontSize: 11, marginTop: 4 }}>
            1216 Lawrence Ave. West, Toronto ON M6A 1E2
          </Text>
          <Text style={{ fontSize: 11 }}>
            PH:(416) 256-7278 FAX:(416) 256-7697
          </Text>
        </View>

        {/* ===== REPORT TITLE ===== */}
        <Text style={styles.header}>{patient.name}'s Lab Results</Text>

        <Text>
          Date of Collection: {collectionDate.toLocaleString()}
        </Text>

        {/* ===== PATIENT INFO ===== */}
        <Text style={{ marginTop: 12, fontWeight: "bold", marginBottom: 4 }}>
          Patient Information
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Field</Text>
            <Text style={styles.tableColHeader}>Details</Text>
            <Text style={styles.tableColHeader}></Text>
            <Text style={styles.tableColHeader}></Text>
          </View>

          {[
            ["DOB", patient.dob],
            ["Gender", patient.gender],
            ["Email", patient.email],
            ["Phone", patient.phone],
            ["Address", patient.address],
            ["Primary Physician", patient.primaryCarePhysician],
            ["Medicare", patient.insurance.medicare],
            ["Medicaid", patient.insurance.medicaid],
          ].map(([field, value]) => (
            <View style={styles.tableRow} key={field}>
              <Text style={styles.tableCol}>{field}</Text>
              <Text style={styles.tableCol}>{value}</Text>
              <Text style={styles.tableCol}></Text>
              <Text style={styles.tableCol}></Text>
            </View>
          ))}
        </View>

        {/* ===== LAB RESULTS ===== */}
        <Text style={styles.sectionTitle}>Lab Results</Text>

        {Object.entries(sections).map(([sectionName, tests]) => {
          const filteredTests = tests.filter((test) =>
            labResult.orderedItems.includes(test)
          );

          if (filteredTests.length === 0) return null;

          return (
            <View key={sectionName}>
              <Text style={styles.sectionTitle}>{sectionName}</Text>

              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableColHeader}>Test</Text>
                  <Text style={styles.tableColHeader}>Result</Text>
                  <Text style={styles.tableColHeader}>Units</Text>
                  <Text style={styles.tableColHeader}>Reference Range</Text>
                </View>

                {filteredTests.map((test) => (
                  <View style={styles.tableRow} key={test}>
                    <Text style={styles.tableCol}>{test}</Text>
                    <Text style={styles.tableCol}>
                      {labResult.results[test] ?? "—"}
                    </Text>
                    <Text style={styles.tableCol}>
                      {labResult.units[test] ?? "—"}
                    </Text>
                    <Text style={styles.tableCol}>
                      {labResult.referenceRanges[test] ?? "—"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
