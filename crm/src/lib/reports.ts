export const TIMEFRAMES = {
  "1month": "Last month",
  "3months": "3 months",
  "6months": "6 months",
  "1year": "12 months",
  all: "All time",
} as const;
export type Timeframe = keyof typeof TIMEFRAMES;

export const timeframeOf = (v: unknown): Timeframe => (typeof v === "string" && v in TIMEFRAMES ? (v as Timeframe) : "1month");
