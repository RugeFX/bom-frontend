export const statuses = ["Complete", "Incomplete", "In Rental"] as const;

export const statusOptions = statuses.map((status) => ({
  label: status,
  value: status,
}));
