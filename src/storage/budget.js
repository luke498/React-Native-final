import AsyncStorage from "@react-native-async-storage/async-storage";

const BUDGET_KEY = (userId) => `monthly_budget_v2_${userId}`;
export async function getBudget(userId) {
  if (!userId) return {};
  const raw = await AsyncStorage.getItem(BUDGET_KEY(userId));
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export async function setBudget(amount, categoryKey = "", userId) {
  if (!userId) throw new Error("ไม่พบ userId");
  const num = Number(amount);
  if (!Number.isFinite(num) || num < 0) {
    throw new Error("งบประมาณไม่ถูกต้อง");
  }
  const current = await getBudget(userId);
  const updated = { ...current, [categoryKey]: num };
  await AsyncStorage.setItem(BUDGET_KEY(userId), JSON.stringify(updated));
  return updated;
}