"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Patient, LabResult } from "@/types/patient.types";
import { sections } from "../../lib/section";
import { Status, getStatus } from "@/lib/status";

interface LabReportPDFProps {
  patient: Patient;
  labResult: LabResult;
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: "Helvetica" },
  header: { fontSize: 16, textAlign: "center", marginBottom: 12, fontWeight: "bold" },
  sectionTitle: { fontSize: 14, marginVertical: 8, fontWeight: "bold" },
  table: { width: "auto", marginVertical: 8, borderWidth: 1, borderColor: "#ccc" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc" },
  tableRowAlternate: { flexDirection: "row", backgroundColor: "#f9f9f9", borderBottomWidth: 1, borderBottomColor: "#ccc" },
  tableColHeader: { width: "50%", fontWeight: "bold", padding: 6 },
  tableCol: { width: "50%", padding: 6 },
  labCol: { width: "20%", padding: 6 },
  statusCol: { width: "20%", padding: 6 },
  footer: { position: "absolute", fontSize: 10, bottom: 10, left: 0, right: 0, textAlign: "center", color: "#555" },
});

// Helper function for date formatting
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

export const LabReportPDF: React.FC<LabReportPDFProps> = ({ patient, labResult }) => {
  const collectionDate = new Date(labResult.date);
  const printedDate = new Date();

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* HEADER */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 11 }}>Performed By: MED-HEALTH LABORATORIES LTD.</Text>
          <Text style={{ fontSize: 11 }}>www.mhlab.ca | support@mhlab.ca</Text>
          <Text style={{ fontSize: 11, marginTop: 4 }}>1216 Lawrence Ave. West, Toronto ON M6A 1E2</Text>
          <Text style={{ fontSize: 11 }}>PH:(416) 256-7278 FAX:(416) 256-7697</Text>
        </View>

        {/* REPORT TITLE */}
        <Text style={styles.header}>{patient.name}'s Lab Results</Text>
        <Text>Date of Collection: {formatDate(collectionDate)}</Text>
        <Text>Printed Date: {formatDate(printedDate)}</Text>

        {/* PATIENT INFO */}
        <Text style={{ marginTop: 12, fontWeight: "bold", marginBottom: 4 }}>Patient Information</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Field</Text>
            <Text style={styles.tableColHeader}>Details</Text>
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
          ].map(([field, value], index) => (
            <View
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}
              key={field}
            >
              <Text style={styles.tableCol}>{field}</Text>
              <Text style={styles.tableCol}>{value}</Text>
            </View>
          ))}
        </View>

        {/* LAB RESULTS */}
        <Text style={styles.sectionTitle}>Lab Results</Text>
        {Object.entries(sections).map(([sectionName, tests]) => {
          const filteredTests = tests.filter((test) => labResult.orderedItems.includes(test));
          if (filteredTests.length === 0) return null;

          return (
            <View key={sectionName}>
              <Text style={styles.sectionTitle}>{sectionName}</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.labCol}>Test</Text>
                  <Text style={styles.labCol}>Result</Text>
                  <Text style={styles.labCol}>Units</Text>
                  <Text style={styles.labCol}>Reference Range</Text>
                  <Text style={styles.statusCol}>Status</Text>
                </View>
                {filteredTests.map((test, index) => {
                  const value = labResult.results[test];
                  const range = labResult.referenceRanges[test];
                  const numericValue = typeof value === "number" ? value : Number(value);
                  const status: Status = range && !isNaN(numericValue)
                    ? getStatus(numericValue, range)
                    : Status.Normal;

                  return (
                    <View
                      style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}
                      key={test}
                    >
                      <Text style={styles.labCol}>{test}</Text>
                      <Text style={styles.labCol}>{value ?? "—"}</Text>
                      <Text style={styles.labCol}>{labResult.units[test] ?? "—"}</Text>
                      <Text style={styles.labCol}>{range ?? "—"}</Text>
                      <Text style={styles.statusCol}>{status}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* FOOTER */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
