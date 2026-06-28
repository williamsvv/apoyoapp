"use client";

import React from "react";
import { useApp } from "../components/AppContext";
import SupportGroups from "../components/SupportGroups";

export default function Page() {
  const { grupos } = useApp();

  return <SupportGroups grupos={grupos} />;
}
