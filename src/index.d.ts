import React from "react";

export interface NameSet {
  title: string;
  category: "Western" | "Middle Eastern" | "Eastern" | "Ancestry";
  image?: string;
  icon?: React.ReactNode;
  data: string[];
  instructions: string;
}

export interface Name {
  prefix: string;
  base: string;
  suffix: string;
}

export interface HistoryRecord {
  names: string[];
  date: number;
  nameSet: string;
  additionalInstructions: string;
}
