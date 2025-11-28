import { Timestamp } from "firebase/firestore";

export const formatDateFromTimestamp = (
  value: Timestamp | string | undefined
) => {
  if (!value) return "-";
  if (value instanceof Timestamp) {
    return value.toDate().toISOString().split("T")[0];
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in (value as Record<string, unknown>)
  ) {
    return (value as Timestamp).toDate().toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    return value;
  }

  return "-";
};

export const getMillisecondsFromTimestamp = (
  value: Timestamp | string | undefined
): number => {
  if (!value) return 0;
  if (value instanceof Timestamp) {
    return value.toMillis();
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in (value as Record<string, unknown>)
  ) {
    return (value as Timestamp).toDate().getTime();
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};


