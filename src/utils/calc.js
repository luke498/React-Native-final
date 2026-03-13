export function summarize(txs) {
  let income = 0, expense = 0, saveIn = 0;

  for (const t of txs) {
    const a = Number(t.amount) || 0;
    if (t.type === "income") income += a;
    else if (t.type === "expense") expense += a;
    else if (t.type === "save_in") saveIn += a;
  }

  const savings = saveIn;
  const balance = income - expense - saveIn; 
  const total = balance + savings;          

  return { income, expense, saveIn, savings, balance, total };
}