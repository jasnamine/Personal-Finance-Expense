export const formatCurrency = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  });

  const parts = formatter.formatToParts(amount);

  const number = parts
    .filter((p) => p.type !== "currency")
    .map((p) => p.value)
    .join("");

  const symbol = parts.find((p) => p.type === "currency")?.value || currency;

  return `${number} ${symbol}`;
};
