import AsyncStorage from "@react-native-async-storage/async-storage";

const CATEGORIES_KEY = (userId) => `categories_v2_${userId}`; 

const DEFAULT_CATEGORIES = [
  { id: "food", key: "food", label: "อาหาร", isDefault: true },
  { id: "shopping", key: "shopping", label: "ช้อปปิ้ง", isDefault: true },
  { id: "travel", key: "travel", label: "เดินทาง", isDefault: true },
];

const safeParse = (s, fallback) => {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
};

export async function getCategories(userId) {
  if (!userId) return DEFAULT_CATEGORIES;
  const raw = await AsyncStorage.getItem(CATEGORIES_KEY(userId));
  const saved = raw ? safeParse(raw, null) : null;

  if (!saved || !Array.isArray(saved)) {
    await AsyncStorage.setItem(CATEGORIES_KEY(userId), JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }

  return saved;
}

export async function setCategories(userId, next) {
  if (!userId) throw new Error("ไม่พบ userId");
  await AsyncStorage.setItem(CATEGORIES_KEY(userId), JSON.stringify(next));
  return next;
}

export async function addCategory(userId, label) {
  const name = String(label || "").trim();
  if (!name) throw new Error("กรุณากรอกชื่อหมวดหมู่");

  const cats = await getCategories(userId);
  const exists = cats.some((c) => c.label.toLowerCase() === name.toLowerCase());
  if (exists) throw new Error("มีหมวดนี้อยู่แล้ว");

  const id = `c_${Date.now()}`;
  const key = id;
  const next = [...cats, { id, key, label: name, isDefault: false }];

  return await setCategories(userId, next);
}

export async function renameCategory(userId, id, newLabel) {
  const name = String(newLabel || "").trim();
  if (!name) throw new Error("กรุณากรอกชื่อหมวดหมู่");

  const cats = await getCategories(userId);
  const target = cats.find((c) => c.id === id);
  if (!target) throw new Error("ไม่พบหมวดหมู่");

  const exists = cats.some(
    (c) => c.id !== id && c.label.toLowerCase() === name.toLowerCase()
  );
  if (exists) throw new Error("มีหมวดนี้อยู่แล้ว");

  const next = cats.map((c) => (c.id === id ? { ...c, label: name } : c));
  return await setCategories(userId, next);
}

export async function deleteCategory(userId, id) {
  const cats = await getCategories(userId);
  const target = cats.find((c) => c.id === id);
  if (!target) throw new Error("ไม่พบหมวดหมู่");

  const next = cats.filter((c) => c.id !== id);
  if (next.length === 0) throw new Error("ต้องมีหมวดอย่างน้อย 1 หมวด");

  return await setCategories(userId, next);
}

export function getCategoryLabelByKey(categories, key) {
  const found = categories.find((c) => c.key === key || c.id === key);
  return found?.label || "อื่นๆ";
}