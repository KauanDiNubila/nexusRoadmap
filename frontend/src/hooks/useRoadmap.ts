import { useContext } from "react";
import { RoadmapContext } from "@/context/RoadmapContext";

export function useRoadmap() {
  const ctx = useContext(RoadmapContext);
  if (!ctx) throw new Error("useRoadmap must be used within a RoadmapProvider");
  return ctx;
}
