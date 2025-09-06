import { NextResponse } from "next/server";
import { fetchOierDetailByUid } from "@/lib/oier";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const paramsAwait = await params;
  const uidNumber = Number.parseInt(paramsAwait.uid, 10);
  if (!Number.isFinite(uidNumber)) {
    return NextResponse.json({ error: "invalid uid" }, { status: 400 });
  }
  const detail = await fetchOierDetailByUid(uidNumber);
  if (!detail) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(detail);
}


