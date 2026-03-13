export const toNumber = (v) => {
  if (typeof v === "string") {
    const cleaned = v.replace(/[^0-9.-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const toDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const startOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
};

export const startOfYear = () => {
  const d = new Date();
  return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
};

export const startOfLastNDays = (n) => {
  const d = startOfToday();
  d.setDate(d.getDate() - (n - 1));
  return d;
};
