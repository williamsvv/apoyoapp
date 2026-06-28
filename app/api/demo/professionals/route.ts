import { NextResponse } from "next/server";
import { getDemoState, saveDemoState } from "@/lib/demo-store";
import type { Professional } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getDemoState().professionals);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Professional, "id">;
  const existing = getDemoState().professionals.find(
    (professional) => professional.email?.toLowerCase() === body.email?.toLowerCase()
  );

  if (existing) {
    return NextResponse.json(existing);
  }

  const professional: Professional = {
    ...body,
    id: crypto.randomUUID()
  };

  const state = getDemoState();
  state.professionals = [...state.professionals, professional];
  saveDemoState(state);

  return NextResponse.json(professional, { status: 201 });
}
