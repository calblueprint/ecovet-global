import { NextRequest, NextResponse } from "next/server";
import { sessionParticipants } from "@/api/supabase/queries/sessions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionID: string }> }
) {
  try {
    const { sessionID } = await params;

    const participants = await sessionParticipants(sessionID as string);

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Failed to fetch participants", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}
