export const simplifyDebts = (balances: Record<string, number>) => {
  const creditors = [];
  const debtors = [];

  for (const [user, balance] of Object.entries(balances)) {
    if (balance > 0) creditors.push({ user, amount: balance });
    if (balance < 0) debtors.push({ user, amount: -balance });
  }

  const settlements = [];

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const min = Math.min(creditor.amount, debtor.amount);

    settlements.push({
      from: debtor.user,
      to: creditor.user,
      amount: min,
    });

    creditor.amount -= min;
    debtor.amount -= min;

    if (creditor.amount === 0) creditors.shift();
    if (debtor.amount === 0) debtors.shift();
  }

  return settlements;
};
