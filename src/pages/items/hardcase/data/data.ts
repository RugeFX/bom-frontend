export const statuses = ["Ready For Rent", "Scrab", "In Rental","Out Of Service"] as const;

export const statusOptions = statuses.map((status) => ({
  label: status,
  value: status,
}));
