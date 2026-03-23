export const getInitials = (name: string | undefined): string => {
  if (!name) return "??";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const firstLetter = parts[0].charAt(0);
  const lastLetter = parts[parts.length - 1].charAt(0);

  return (firstLetter + lastLetter).toUpperCase();
};
