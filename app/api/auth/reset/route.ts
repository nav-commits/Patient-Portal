import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const patientSnap = await adminDb
    .collection("patients")
    .where("email", "==", email)
    .get();

  if (patientSnap.empty) return NextResponse.json({ error: "No patient found" }, { status: 403 });

  return NextResponse.json({ success: true });
}