import { NextResponse } from "next/server";
import { getDemoState, saveDemoState } from "@/lib/demo-store";
import type { HelpRequest } from "@/lib/types";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const patch = (await request.json()) as Partial<HelpRequest>;
  const state = getDemoState();
  const existing = state.requests.find((item) => item.id === id);

  if (!existing) {
    return NextResponse.json({ message: "Solicitud no encontrada" }, { status: 404 });
  }

  state.requests = state.requests.map((item) => (item.id === id ? { ...item, ...patch } : item));
  saveDemoState(state);
  return NextResponse.json(state.requests.find((item) => item.id === id));
}
