import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Check patient exists
    const patientSnap = await adminDb
      .collection("patients")
      .where("email", "==", decoded.email)
      .get();
    if (patientSnap.empty) return NextResponse.json({ error: "Patient not found" }, { status: 403 });

    // Create or update user doc
    const patientData = patientSnap.docs[0].data();
    await adminDb.collection("users").doc(uid).set(
      { email: decoded.email, patientId: patientSnap.docs[0].id, name: patientData.name || null },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}