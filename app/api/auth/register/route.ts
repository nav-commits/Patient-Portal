import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1️⃣ Check patient exists
    const patientSnap = await adminDb
      .collection("patients")
      .where("email", "==", email)
      .get();

    if (patientSnap.empty) {
      return NextResponse.json({ error: "Patient not found" }, { status: 403 });
    }

    const patientData = patientSnap.docs[0].data();
    const patientId = patientSnap.docs[0].id;

    // 2️⃣ Check if user already registered
    const existingUsers = await adminDb
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!existingUsers.empty) {
      return NextResponse.json({ error: "User already registered" }, { status: 409 });
    }

    // 3️⃣ Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    // 4️⃣ Create Firestore user doc
    await adminDb.collection("users").doc(userRecord.uid).set({
      email,
      patientId,
      name: patientData.name || null,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Registration failed" }, { status: 500 });
  }
}