import dayjs from "dayjs";

export const formatDate = (date?: Date | string | null): string => {
  if (!date) return "N/A";

  const d = dayjs(date);

  if (!d.isValid()) return "N/A";

  return d.format("DD/MM/YYYY");
};

export const formatDateTime = (date?: Date | string | null): string => {
  if (!date) return "N/A";
  const d = dayjs(date);
  if (!d.isValid()) return "N/A";

  return d.format("HH:mm - DD/MM/YYYY");
};
