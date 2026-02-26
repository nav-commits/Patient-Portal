import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const { uid, email } = decoded;

    // Fetch user document
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userData = userDoc.data();
    if (!userData?.patientId) return NextResponse.json({ error: "User has no associated patient" }, { status: 404 });

    // Fetch patient document
    const patientDoc = await adminDb.collection("patients").doc(userData.patientId).get();
    if (!patientDoc.exists) return NextResponse.json({ error: "Patient data not found" }, { status: 404 });

    const patientData = patientDoc.data();
    if (!patientData) {
      return NextResponse.json({ error: "Patient data is undefined" }, { status: 500 });
    }

    const patient = {
      uid,
      email,
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

    return NextResponse.json({ patient });
  } catch (err: any) {
    console.error("Failed to fetch patient data:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}