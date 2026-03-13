export function formatMoney(n) {
  return (Number(n) || 0).toLocaleString("th-TH");
}

export function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString("th-TH"); }
  catch { return String(iso || ""); }
}