export const statuses = ["Ready For Rent", "Out Of Service", "In Rental"] as const;

export const statusOptions = statuses.map((status) => ({
  label: status,
  value: status,
}));
