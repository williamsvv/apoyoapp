import { NextResponse } from "next/server";
import { getDemoState, saveDemoState } from "@/lib/demo-store";
import type { HelpRequest } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getDemoState().requests);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<HelpRequest, "id" | "createdAt">;
  const nextRequest: HelpRequest = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  const state = getDemoState();
  state.requests = [nextRequest, ...state.requests];
  saveDemoState(state);

  return NextResponse.json(nextRequest, { status: 201 });
}
