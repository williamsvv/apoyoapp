import type { HelpRequest, Professional } from "@/lib/types";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type DemoState = {
  professionals: Professional[];
  requests: HelpRequest[];
};

const globalForDemo = globalThis as typeof globalThis & {
  apoyoDemoState?: DemoState;
};

const demoStorePath = join(process.cwd(), ".demo-store.json");

function readStoreFile(): DemoState {
  if (!existsSync(demoStorePath)) {
    return {
      professionals: [],
      requests: []
    };
  }

  try {
    return JSON.parse(readFileSync(demoStorePath, "utf8")) as DemoState;
  } catch {
    return {
      professionals: [],
      requests: []
    };
  }
}

export function getDemoState() {
  globalForDemo.apoyoDemoState = readStoreFile();

  return globalForDemo.apoyoDemoState;
}

export function saveDemoState(state: DemoState) {
  globalForDemo.apoyoDemoState = state;
  writeFileSync(demoStorePath, JSON.stringify(state, null, 2));
}
