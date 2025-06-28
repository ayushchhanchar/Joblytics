export const ApplicationStatusList = [
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "GHOSTED",
] as const;

export type ApplicationStatus = (typeof ApplicationStatusList)[number];

export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
};  