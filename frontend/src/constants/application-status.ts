export const ApplicationStatusList = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "HIRED",
] as const;

export type ApplicationStatus = (typeof ApplicationStatusList)[number];

// Optional map for displaying nice labels
export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  HIRED: "Hired",
};