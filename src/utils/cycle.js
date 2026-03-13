export const CYCLES = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
};

export function filterByCycle(transactions, cycle) {
  const now = new Date();

  return transactions.filter((t) => {
    const d = new Date(t.date);

    if (cycle === CYCLES.DAY) {
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }

    if (cycle === CYCLES.WEEK) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return d >= oneWeekAgo;
    }

    if (cycle === CYCLES.MONTH) {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });
}