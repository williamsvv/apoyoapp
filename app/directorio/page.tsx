"use client";

import React from "react";
import { useApp } from "../components/AppContext";
import VolunteersDirectory from "../components/VolunteersDirectory";

export default function Page() {
  const { voluntarios } = useApp();

  return <VolunteersDirectory voluntarios={voluntarios} />;
}
